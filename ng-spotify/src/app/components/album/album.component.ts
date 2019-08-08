import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { Album } from '../../modeles/album';

import {ActivatedRoute} from '@angular/router';
import {RouterModule,Routes} from '@angular/router';

@Component({
  selector: 'album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit {
  id: string;
  albums: Album[];

  constructor(
    private _spotifyService: SpotifyService,
    private _route:ActivatedRoute
  ) { }

  ngOnInit() {
    this._route.params
               .map(params => params['id'])
               .subscribe((id) => {
                 this._spotifyService.getAlbum(id)
                                     .subscribe( albums => {
                                       this.albums = albums;
                                     })
              })
  }

}
