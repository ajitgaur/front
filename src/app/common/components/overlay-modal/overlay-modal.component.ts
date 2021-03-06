import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  HostBinding,
  Injector,
  ViewChild,
} from '@angular/core';

import { DynamicHostDirective } from '../../directives/dynamic-host.directive';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  moduleId: module.id,
  selector: 'm-overlay-modal',
  templateUrl: 'overlay-modal.component.html',
  animations: [
    trigger('fadeOut', [
      transition(':enter', [
        style({ opacity: '1' }),
        animate(
          '500ms 1s cubic-bezier(0.23, 1, 0.32, 1)',
          style({ opacity: '0' })
        ),
      ]),
    ]),
  ],
})
export class OverlayModalComponent implements AfterViewInit {
  hidden: boolean = true;
  class: string = '';
  wrapperClass: string = '';
  root: HTMLElement;
  isMediaModal: boolean = false;

  @ViewChild(DynamicHostDirective, { static: true })
  private host: DynamicHostDirective;

  private componentRef: ComponentRef<{}>;
  private componentInstance;

  @ViewChild('modalElement', { static: true })
  protected modalElement: ElementRef;

  constructor(
    private service: OverlayModalService,
    private _componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngAfterViewInit() {
    if (!this.root && document && document.body) {
      this.root = document.body;
    }

    this.service.setContainer(this);
  }

  create(componentClass, opts?, injector?: Injector) {
    this.dismiss();

    opts = {
      class: '',
      wrapperClass: '',
      inputValues: {},
      ...opts,
    };

    this.class = opts.class;
    this.wrapperClass = opts.wrapperClass || '';

    this.isMediaModal =
      this.class.indexOf('m-overlayModal--media') > -1 ? true : false;

    if (!componentClass) {
      throw new Error('Unknown component class');
    }

    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(
        componentClass
      ),
      viewContainerRef = this.host.viewContainerRef;

    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(
      componentFactory,
      void 0,
      injector
    );
    this.componentInstance = this.componentRef.instance;
    this.componentInstance.parent = this.modalElement.nativeElement;

    for (const inputKey in opts.inputValues) {
      if (opts.inputValues.hasOwnProperty(inputKey)) {
        if (!this.componentInstance.hasOwnProperty(inputKey)) {
          throw new Error(
            `${inputKey} does not exist in ${this.componentInstance}`
          );
        }

        this.componentInstance[inputKey] = opts.inputValues[inputKey];
      }
    }
  }

  setRoot(root: HTMLElement) {
    this.root = root;
  }

  setData(data) {
    if (!this.componentInstance) {
      return;
    }

    this.componentInstance.data = data;
    this.componentRef.changeDetectorRef.detectChanges();
  }

  setOpts(opts) {
    if (!this.componentInstance) {
      return;
    }

    this.componentInstance.opts = opts;
  }

  present() {
    if (!this.componentInstance) {
      return;
    }

    this.hidden = false;

    if (this.root) {
      this.root.classList.add('m-overlay-modal--shown');
      document.body.classList.add('m-overlay-modal--shown--no-scroll');
    }
  }

  onEscKeyup() {
    if (this.isMediaModal) {
      this.dismiss();
    }
  }

  dismiss() {
    this.hidden = true;

    if (this.root) {
      this.root.classList.remove('m-overlay-modal--shown');
      document.body.classList.remove('m-overlay-modal--shown--no-scroll');
    }

    if (!this.componentInstance) {
      return;
    }

    try {
      this.service._didDismiss();
    } catch (e) {
      console.warn('Error on callback while dismissing modal', e);
    }

    this.componentRef.destroy();
    this.host.viewContainerRef.clear();
  }

  @HostBinding('class') get wrapperComponentCssClass() {
    return this.wrapperClass || '';
  }
}
