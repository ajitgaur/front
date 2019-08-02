import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Client } from "../../../../../services/api/client";
import { removeCurrentUnits } from "../../../util";

@Component({
  selector: 'm-analyticscharts__channelboosts',
  template: `
    <div class="m-chart" #chartContainer>
      <div class="mdl-spinner mdl-js-spinner is-active" [mdl] *ngIf="inProgress"></div>

      <m-graph
        [data]="data"
        [layout]="layout"
        *ngIf="!inProgress && !!data"
      ></m-graph>
    </div>
  `
})

export class ChannelBoostsComponent implements OnInit {
  @Input() analytics: 'totals' | 'monthly';
  @Output() loaded: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();

  @ViewChild('chartContainer', { static: true }) chartContainer: ElementRef;

  inProgress: boolean = false;
  data: any;

  layout: any = {
    width: 0,
    height: 0,
    title: '',
    font: {
      family: 'Roboto'
    },
    titlefont: {
      family: 'Roboto',
      size: 24,
      weight: 'bold'
    },
    xaxis: {
      type: '-',
    },
    yaxis: {
      type: 'log'
    }
  };

  constructor(private client: Client) {

  }

  ngOnInit() {
    this.applyDimensions();
    this.getData();
  }

  async getData() {
    const response: any = await this.client.get(`api/v2/analytics/interactions`, { key: `boost${this.analytics}` });
    this.data = response.data;

    switch (this.analytics) {
      case 'monthly':
        this.layout.title = 'Percentage of Interactions from Boosts';
        const [data, current] = removeCurrentUnits(response.data);
        this.data = data;

        this.loaded.emit(current);

        for (let i = 0; i < this.data.length; i++) {
          this.data[i].stackgroup = 'one';
          this.data[i].groupnorm = 'percent';
        }
        break;
      case 'totals':
        this.layout.title = 'Boosts Interactions by Type';
        this.data[0].type = 'pie';
        break;
    }
  }

  @HostListener('window:resize')
  applyDimensions() {
    this.layout = {
      ...this.layout,
      width: this.chartContainer.nativeElement.clientWidth,
      height: this.chartContainer.nativeElement.clientHeight - 35,
    };
  }
}
