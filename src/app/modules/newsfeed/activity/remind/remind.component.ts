import { Component, Input } from '@angular/core';
import { ActivityEntity, ActivityService } from '../activity.service';

@Component({
  selector: 'm-activity__remind',
  templateUrl: 'remind.component.html',
  providers: [ActivityService],
})
export class ActivityRemindComponent {
  @Input('entity') set entity(entity: ActivityEntity) {
    this.service.setEntity(entity.remind_object);
    this.service.isNsfwConsented$.next(true); // Parent entity should have done this
  }

  /**
   * Whether or not we allow autoplay on scroll
   */
  @Input() allowAutoplayOnScroll: boolean = false;

  /**
   * Whether or not autoplay is allowed (this is used for single entity view, media modal and media view)
   */
  @Input() autoplayVideo: boolean = false;

  @Input() parentService: ActivityService;

  constructor(public service: ActivityService) {}

  ngOnInit() {
    this.service.displayOptions = this.parentService.displayOptions;
  }
}
