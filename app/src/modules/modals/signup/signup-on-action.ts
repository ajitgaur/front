import { Component, EventEmitter } from '@angular/core';

import { Session } from '../../../services/session';

@Component({
  selector: 'm-modal-signup-on-action',
  inputs: ['open', 'action'],
  outputs: ['closed'],
  template: `
    <m-modal-signup open="true" subtitle="You need to have a channel in order to {{action}}" i18n-subtitle="@@MODALS__SIGNUP__ON_ACTION_SUBTITLE" *ngIf="open"></m-modal-signup>
  `
})

export class SignupOnActionModal {

  open: boolean = false;
  action: string = '';
  closed: EventEmitter<any> = new EventEmitter();
  minds = window.Minds;

  constructor(public session: Session) { }

  close() {
    this.open = false;
    this.closed.next(true);
  }

}
