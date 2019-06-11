import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CommonModule } from '../../common/common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckoutModule } from '../checkout/checkout.module';
import { ThirdPartyNetworksModule } from '../third-party-networks/third-party-networks.module';
import { AdsModule } from '../ads/ads.module';
import { FaqModule } from '../faq/faq.module';

import { BoostCreatorComponent } from './creator/creator.component';
import { BoostCreatorPaymentMethodsComponent } from './creator/payment-methods/payment-methods.component';
import { BoostCreatorCheckoutComponent } from './creator/checkout/checkout.component';
import { BoostCreatorP2PSearchComponent } from './creator/p2p-search/p2p-search.component';
import { BoostCreatorCategoriesComponent } from './creator/categories/categories.component';

import { BoostConsoleComponent } from './console/console.component';
import { BoostConsoleTypesComponent } from './console/types.component';
import { BoostConsoleHistoryComponent } from './console/history.component';
import { BoostConsoleNetworkListComponent } from './console/list/network.component';
import { BoostConsoleP2PListComponent } from './console/list/p2p.component';
import { BoostConsoleCard } from './console/card/card.component';
import { BoostConsoleBooster } from './console/booster/booster.component';
import { BoostMarketingComponent } from './marketing.component';
import { BoostPublisherComponent } from './publisher/publisher.component';
import { BoostPublisherEarningsComponent } from './publisher/earnings/earnings.component';
import { BoostPublisherPayoutsComponent } from './publisher/payouts/payouts.component';
import { BoostPublisherSettingsComponent } from './publisher/settings/settings.component';
import { BoostPublisherLedgerComponent } from './publisher/ledger/ledger.component';
import { BoostCampaignsComponent } from "./campaigns/campaigns.component";
import { BoostCampaignsOverviewComponent } from "./campaigns/overview/overview.component";
import { BoostCampaignsCreatorComponent } from "./campaigns/creator/creator.component";
import { BoostCampaignsViewComponent } from "./campaigns/view/view.component";
import { BoostCampaignsListComponent } from "./campaigns/list/list.component";
import { BoostCampaignsCreatorContentSelectorComponent } from './campaigns/creator/content-selector.component';

const boostRoutes: Routes = [
  { path: 'boost/console', component: BoostConsoleComponent,
    children: [
      { path: '', redirectTo: 'newsfeed/history', pathMatch: 'full' },
      { path: 'publisher', component: BoostPublisherComponent,
        children: [
          { path: '', redirectTo: 'earnings', pathMatch: 'full' },
          { path: 'earnings', component: BoostPublisherEarningsComponent },
          { path: 'payouts', component: BoostPublisherPayoutsComponent },
          { path: 'settings', component: BoostPublisherSettingsComponent },
        ]
      },
      { path: 'publisher/:filter', component: BoostPublisherComponent },
      { path: ':type', component: BoostConsoleTypesComponent,
        children: [
          { path: '', redirectTo: 'history', pathMatch: 'full' },
          { path: 'create', component: BoostConsoleBooster },
          { path: 'history', component: BoostConsoleHistoryComponent },
          { path: 'history/:filter', component: BoostConsoleHistoryComponent },
        ]
      },
    ]
  },
  {
    path: 'boost/campaigns',
    component: BoostCampaignsComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'overview',
        component: BoostCampaignsOverviewComponent,
      },
      {
        path: 'list',
        component: BoostCampaignsListComponent,
      },
      {
        path: 'create',
        component: BoostCampaignsCreatorComponent,
      },
      {
        path: 'edit/:id',
        component: BoostCampaignsCreatorComponent,
      },
      {
        path: ':id',
        component: BoostCampaignsViewComponent,
      },
    ],
  },
  { path: 'boost', component: BoostMarketingComponent }
];

@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(boostRoutes),
    CommonModule,
    CheckoutModule,
    ThirdPartyNetworksModule,
    AdsModule,
    FaqModule
  ],
  declarations: [
    BoostCreatorComponent,
    BoostPublisherComponent,
    BoostConsoleComponent,
    BoostConsoleNetworkListComponent,
    BoostConsoleP2PListComponent,
    BoostConsoleCard,
    BoostConsoleBooster,
    BoostMarketingComponent,
    BoostCreatorPaymentMethodsComponent,
    BoostCreatorCheckoutComponent,
    BoostCreatorP2PSearchComponent,
    BoostCreatorCategoriesComponent,
    BoostConsoleTypesComponent,
    BoostConsoleHistoryComponent,
    BoostPublisherEarningsComponent,
    BoostPublisherPayoutsComponent,
    BoostPublisherSettingsComponent,
    BoostPublisherLedgerComponent,
    BoostCampaignsComponent,
    BoostCampaignsOverviewComponent,
    BoostCampaignsListComponent,
    BoostCampaignsCreatorComponent,
    BoostCampaignsCreatorContentSelectorComponent,
    BoostCampaignsViewComponent,
  ],
  exports: [
    BoostConsoleNetworkListComponent,
    BoostConsoleP2PListComponent,
    BoostConsoleCard,
    BoostConsoleBooster
  ],
  entryComponents: [
    BoostCreatorComponent,
    BoostConsoleComponent,
    BoostCampaignsComponent,
    BoostMarketingComponent,
  ]
})
export class BoostModule {
}
