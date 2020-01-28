import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, pairwise } from 'rxjs/operators';

@Injectable()
export class ScrollToTopService {
  private _routerListener: Subscription;

  static _(router: Router, route: ActivatedRoute) {
    return new ScrollToTopService(router, route);
  }

  constructor(private router: Router, private route: ActivatedRoute) {}

  listen(): this {
    this._routerListener = this.router.events
      .pipe(
        filter((e: any) => e instanceof RoutesRecognized),
        pairwise()
      )
      .subscribe((events: RoutesRecognized[]) => {
        // TODOOJM change to wallet
        const disabledPaths: Array<string> = ['v2wallet'],
          previousPath = events[0].urlAfterRedirects.split('/')[1],
          currentPath = events[1].urlAfterRedirects.split('/')[1];

        const currentPathDisabled = disabledPaths.indexOf(currentPath) > -1;
        const pathChanged = previousPath !== currentPath;

        if (!currentPathDisabled || (currentPathDisabled && pathChanged)) {
          window.scrollTo(0, 0);
        }
      });
    return this;
  }

  unlisten(): this {
    this._routerListener.unsubscribe();
    return this;
  }
}
