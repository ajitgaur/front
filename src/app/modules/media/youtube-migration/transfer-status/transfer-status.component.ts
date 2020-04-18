import { Component, OnInit } from '@angular/core';
import { YoutubeMigrationService } from '../youtube-migration.service';

@Component({
  selector: 'm-youtubeMigration__transferStatus',
  templateUrl: './transfer-status.component.html',
})
export class YoutubeMigrationTransferStatusComponent implements OnInit {
  constructor(protected youtubeService: YoutubeMigrationService) {}

  ngOnInit() {}
}
