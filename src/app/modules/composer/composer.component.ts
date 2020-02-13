import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { UniqueId } from '../../helpers/unique-id.helper';
import { ButtonComponentAction } from '../../common/components/button-v2/button.component';
import { ComposerService } from './composer.service';
import { FileUploadSelectEvent } from '../../common/components/file-upload/file-upload.component';

@Component({
  selector: 'm-composer',
  providers: [ComposerService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'composer.component.html',
})
export class ComposerComponent implements OnInit, OnDestroy {
  id: string = UniqueId.generate('m-composer');
  poppedOut: boolean = false;

  constructor(public service: ComposerService) {}

  ngOnInit(): void {
    // TODO: Initialize based on bindings

    this.service.message$.next('');
    this.service.attachment$.next(null);
    this.service.nsfw$.next(null);
    this.service.monetization$.next(null);
    this.service.scheduler$.next(null);
  }

  ngOnDestroy(): void {
    // TODO: Destroy subscriptions
    // TODO: GC
  }

  setMessage(message: string) {
    this.service.message$.next(message);
  }

  setAttachment(file) {
    this.service.attachment$.next(file);
  }

  setNsfw() {
    // TODO: Set NSFW flags
    this.service.nsfw$.next([+Date.now()]);
  }

  setMonetization() {
    // TODO: Set Monetization attributes
    this.service.monetization$.next({ monetization: +Date.now() });
  }

  setTags() {
    this.service.alterMessageTags(/* Tags */);
  }

  setScheduler() {
    // TODO: Set Scheduler attributes
    this.service.scheduler$.next({ scheduler: +Date.now() });
  }

  async onPost($event: ButtonComponentAction) {
    try {
      const response = await this.service.post();
    } catch (e) {
      console.log(e);
      // TODO: Display errors nicely and with a clear language
    }
  }

  popOut() {
    // this.poppedOut = true;
  }
}

// use combineLatest with
