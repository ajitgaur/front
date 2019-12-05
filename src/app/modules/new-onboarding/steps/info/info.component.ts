import { Component, HostListener } from '@angular/core';
import { Session } from '../../../../services/session';
import { MindsUser } from '../../../../interfaces/entities';
import { Client } from '../../../../services/api';
import { Router } from '@angular/router';

@Component({
  selector: 'm-info__step',
  templateUrl: 'info.component.html',
})
export class InfoStepComponent {
  user: MindsUser;

  steps = [
    {
      name: 'Hashtags',
      selected: false,
    },
    {
      name: 'Info',
      selected: true,
    },
    {
      name: 'Groups',
      selected: false,
    },
    {
      name: 'Channels',
      selected: false,
    },
  ];

  monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  days = [1];
  years = [];

  selectedMonth = 'January';
  selectedDay = '1';
  selectedYear = new Date().getFullYear();
  tooltipAnchor: 'top' | 'left' = 'left';
  confirming: boolean = false;
  inProgress: boolean = false;

  number: number;
  code: number;
  secret: string;
  location: string;

  error: string;

  constructor(
    private session: Session,
    private client: Client,
    private router: Router
  ) {
    this.user = session.getLoggedInUser();
    this.years = this.range(100, this.selectedYear, false);
    this.selectedYear = this.years[0];
    this.selectMonth('January');

    this.onResize();
  }

  selectMonth(month: string) {
    this.selectedMonth = month;

    this.populateDays(
      this.getDaysInMonth(this.getMonthNumber(month), this.selectedYear)
    );
  }

  selectYear(year) {
    this.selectedYear = year;

    this.populateDays(
      this.getDaysInMonth(this.getMonthNumber(this.selectedMonth), year)
    );
  }

  async updateMobileNumber() {
    try {
      const response: any = await this.client.post('api/v1/channel/info', {
        phone_number: this.number,
      });
    } catch (e) {
      console.error(e);
    }
  }

  async updateLocation() {
    try {
      const response: any = await this.client.post('api/v1/channel/info', {
        city: this.location,
      });
    } catch (e) {
      console.error(e);
    }
  }

  async updateDateOfBirth() {
    try {
      const response: any = await this.client.post('api/v1/channel/info', {
        dob: this.build(),
      });
    } catch (e) {
      console.error(e);
    }
  }

  build() {
    let date: string = '';

    if (this.selectedMonth !== '') {
      if (this.selectedYear) {
        date = `${this.pad(this.selectedYear, 4)}-`;
      }

      date += `${this.pad(this.selectedMonth, 2)}`;

      if (this.selectedDay) {
        date += `-${this.pad(this.selectedDay, 2)}`;
      }
    }

    return date;
  }

  phoneInputKeypress(event: any) {
    if (event.code === 'Enter' || event.code === 'NumpadEnter') {
      if (!this.inProgress) {
        this.verify();
      }
    }
  }

  codeKeypress(event: any) {
    if (event.code === 'Enter' || event.code === 'NumpadEnter') {
      if (!this.inProgress) {
        this.confirm();
      }
    }
  }

  async verify() {
    this.inProgress = true;
    this.error = null;
    try {
      const response: any = await this.client.post(
        'api/v2/blockchain/rewards/verify',
        {
          number: this.number,
        }
      );
      this.secret = response.secret;
      this.confirming = true;
    } catch (e) {
      this.error = e.message;
    }
    this.inProgress = false;
  }

  async confirm() {
    this.inProgress = true;
    this.error = null;
    try {
      const response: any = await this.client.post(
        'api/v2/blockchain/rewards/confirm',
        {
          number: this.number,
          code: this.code,
          secret: this.secret,
        }
      );

      window.Minds.user.rewards = true;
    } catch (e) {
      this.error = e.message;
    }

    this.inProgress = false;
  }

  cancel() {
    this.confirming = false;
    this.code = null;
    this.secret = null;
    this.inProgress = false;
    this.error = null;
  }

  skip() {
    this.saveData();
    this.router.navigate(['/onboarding', 'hashtags']);
  }

  continue() {
    this.saveData();
    this.router.navigate(['/onboarding', 'groups']);
  }

  @HostListener('window:resize')
  onResize() {
    this.tooltipAnchor = window.innerWidth <= 480 ? 'top' : 'left';
  }

  private validate() {}

  private saveData() {
    this.updateMobileNumber();
    this.updateLocation();
    this.updateDateOfBirth();
  }

  private range(size, startAt = 0, grow = true): Array<number> {
    return Array.from(Array(size).keys()).map(i => {
      if (grow) {
        return i + startAt;
      } else {
        return startAt - i;
      }
    });
  }

  private populateDays(maxDays: number) {
    this.days = this.range(maxDays, 1);
  }

  private getMonthNumber(month: string): number {
    return this.monthNames.indexOf(month);
  }

  private getDaysInMonth(month, year): number {
    // let date = new Date(Date.UTC(year, month, 1));
    const date = new Date(year, month, 1);
    let day = 0;
    while (date.getMonth() === month) {
      day = date.getDate();
      date.setDate(date.getDate() + 1);
    }
    return day;
  }

  private pad(val: any, pad: number = 0) {
    if (!pad) {
      return val;
    }

    return (Array(pad + 1).join('0') + val).slice(-pad);
  }
}
