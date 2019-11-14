import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { ProService } from '../pro.service';
import { Session } from '../../../services/session';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MindsTitle } from '../../../services/ux/title';
import { SiteService } from '../../../common/services/site.service';
import { debounceTime } from 'rxjs/operators';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormToastService } from '../../../common/services/form-toast.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'm-proSettings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'settings.component.html',
})
export class ProSettingsComponent implements OnInit, AfterViewInit, OnDestroy {
  activeForm: NgForm;
  activeTab: any;
  tabs = [
    {
      id: 'general',
      title: 'General',
      subtitle: 'Customize your title and headline',
    },
    {
      id: 'theme',
      title: 'Theme',
      subtitle: "Set up your site's color theme",
    },
    {
      id: 'assets',
      title: 'Assets',
      subtitle: 'Upload custom logo and background images',
    },
    {
      id: 'hashtags',
      title: 'Hashtags',
      subtitle: 'Set up your category filter hashtags here',
    },
    {
      id: 'footer',
      title: 'Footer',
      subtitle: "Set up your site's footer links",
    },
    {
      id: 'domain',
      title: 'Domain',
      subtitle: 'Customize your site domain',
    },
  ];

  settings: any;

  init: boolean = false;

  inProgress: boolean;

  saved: boolean = false;

  user: string | null = null;

  isDomainValid: boolean | null = null;

  error: string;

  hexPattern = '^#?([0-9A-Fa-f]{3}){1,2}$'; // accepts both 3- and 6-digit codes, hash is optional

  domainValidationSubject: Subject<any> = new Subject<any>();

  protected paramMap$: Subscription;

  protected param$: Subscription;

  protected domainValidation$: Subscription;

  @ViewChild('logoField', { static: false })
  protected logoField: ElementRef<HTMLInputElement>;

  @ViewChild('backgroundField', { static: false })
  protected backgroundField: ElementRef<HTMLInputElement>;

  // TODO: make one of these for each form
  @ViewChild('themeForm', { static: false }) themeForm: NgForm;

  constructor(
    protected service: ProService,
    protected session: Session,
    protected router: Router,
    protected route: ActivatedRoute,
    protected cd: ChangeDetectorRef,
    protected title: MindsTitle,
    protected site: SiteService,
    protected sanitizer: DomSanitizer,
    private formToastService: FormToastService
  ) {}

  ngOnInit() {
    this.paramMap$ = this.route.paramMap.subscribe((params: ParamMap) => {
      const activeTabParam = params.get('tab');
      this.activeTab = this.tabs.find(tab => tab.id === activeTabParam);
      this.activeTab['saveStatus'] = 'unsaved';
      if (this.init) {
        this.getActiveForm();
        this.detectChanges();
      }
    });

    this.param$ = this.route.params.subscribe(params => {
      if (this.session.isAdmin()) {
        this.user = params['user'] || null;
      }

      this.load();
    });

    this.domainValidation$ = this.domainValidationSubject
      .pipe(debounceTime(300))
      .subscribe(() => this.validateDomain());
  }

  ngAfterViewInit() {
    this.init = true;
    this.getActiveForm();
    this.detectChanges();
  }

  getActiveForm() {
    const tempFormStr = this.activeTab.id + 'Form';
    this.activeForm = this[tempFormStr];
    console.log(this.activeForm);
  }
  ngOnDestroy() {
    this.paramMap$.unsubscribe();
    this.param$.unsubscribe();
    this.domainValidation$.unsubscribe();
  }

  async load() {
    this.inProgress = true;
    this.detectChanges();

    const { isActive, settings } = await this.service.get(this.user);

    if (!isActive && !this.user) {
      this.router.navigate(['/pro'], { replaceUrl: true });
      return;
    }

    this.settings = settings;

    this.title.setTitle('Pro Settings');

    this.inProgress = false;
    this.detectChanges();
  }

  async validateDomain() {
    this.isDomainValid = null;
    this.detectChanges();

    try {
      const { isValid } = await this.service.domainCheck(
        this.settings.domain,
        this.user
      );

      this.isDomainValid = isValid;
    } catch (e) {
      this.isDomainValid = null;
      this.error = (e && e.message) || 'Error checking domain';
      this.formToastService.error(this.error);
    }

    this.detectChanges();
  }

  onAssetFileSelect(type: string, files: FileList | null) {
    if (!files || !files.item(0)) {
      this.settings[type] = null;
      this.detectChanges();
      return;
    }

    this.settings[type] = files.item(0);
    this.detectChanges();
  }

  protected async uploadAsset(
    type: string,
    file: File,
    htmlInputFileElementRef: ElementRef<HTMLInputElement> | null = null
  ): Promise<void> {
    await this.service.upload(type, file, this.user);

    if (htmlInputFileElementRef && htmlInputFileElementRef.nativeElement) {
      try {
        htmlInputFileElementRef.nativeElement.value = '';
      } catch (e) {
        console.warn(`Browser prevented ${type} field resetting`);
      }
    }
  }

  getPreviewAssetSrc(type: string): string | SafeUrl {
    if (this.settings[type]) {
      if (!this.settings[type]._mindsBlobUrl) {
        this.settings[type]._mindsBlobUrl = URL.createObjectURL(
          this.settings[type] as File
        );
      }

      return this.sanitizer.bypassSecurityTrustUrl(
        this.settings[type]._mindsBlobUrl
      );
    }

    return this.settings[`${type}_image`];
  }

  onSubmit(form) {
    console.log(form);
    console.log(form.value);
    this.error = null;
    this.activeTab.saveStatus = 'saving';
    this.detectChanges();

    // TODO: add '#' to colors without them
  }

  async save() {
    this.error = null;
    this.inProgress = true;
    this.detectChanges();

    try {
      const { logo, background, ...settings } = this.settings;

      const uploads: Promise<any>[] = [];

      if (logo) {
        uploads.push(this.uploadAsset('logo', logo, this.logoField));
        settings.has_custom_logo = true;
      }

      if (background) {
        uploads.push(
          this.uploadAsset('background', background, this.backgroundField)
        );
        settings.has_custom_background = true;
      }

      await Promise.all(uploads);

      this.settings = settings;
      await this.service.set(this.settings, this.user);
      this.formToastService.success(
        'Pro settings have been successfully updated'
      );
      this.activeTab.saveStatus = 'saved';
    } catch (e) {
      this.error = e.message;
      this.formToastService.error('Error: ' + this.error);
      this.activeTab.saveStatus = 'unsaved';
    }

    this.saved = true;
    this.inProgress = false;
    this.detectChanges();
  }

  addBlankTag() {
    if (!this.settings) {
      return;
    }

    this.settings.tag_list.push({ label: '', tag: '' });
  }

  // removeTag(index: number) {
  //   this.settings.tag_list.splice(index, 1);
  // }

  addBlankFooterLink() {
    if (!this.settings) {
      return;
    }

    this.settings.footer_links.push({ title: '', href: '' });
  }

  // removeFooterLink(index: number) {
  //   this.settings.footer_links.splice(index, 1);
  // }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  get previewRoute() {
    return ['/pro', this.user || this.session.getLoggedInUser().username];
  }

  get ratios() {
    return this.service.ratios;
  }

  get isRemote() {
    return Boolean(this.user);
  }

  get isAdmin() {
    return this.session.isAdmin();
  }
}
