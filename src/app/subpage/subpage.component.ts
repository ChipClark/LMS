// page.components.ts

import { Component, OnInit, Input, ViewChild, ViewChildren } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl, SafeValue } from '@angular/platform-browser';
import { Page, Tags, assoc_top_tag, SubPage } from '../datatables/page';
import { HttpClient, HttpHeaders, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIService } from '../api.service';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { PageComponent } from '../page/page.component';

// datatables 

@Component({
  selector: 'app-page',
  templateUrl: './subpage.component.html',
  styleUrls: ['./subpage.component.css'],
})

@Injectable({
  providedIn: 'root'
})

export class SubpageComponent implements OnInit {

  public pageURL = '../assets/tempdata.json';
  public tagsURL = '../assets/temptags.json';
  public subpageURL = '../assets/tempsubpage.json';
  public connectionURL = '../assets/tempconnections.json';

  // Filters


  //includes

  @ViewChildren('nGForArray') filtered;

  url: string;
  top_page: Page[];
  tags: Tags[];
  subpage: SubPage[];
  connect_tags: assoc_top_tag[];

  public tagid: any;

  //completePerson: PersonPage[];
  router: RouterLink;

  constructor(
    private staffService: APIService,
    private http: HttpClient,
    protected sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private _router: Router,
    private location: Location
  ) { }

  ngOnInit() {
    this.getData();
  }

  getData(): any {
    //console.log(this.baseURL);
    this.staffService.getPageData(this.pageURL)
      .subscribe(top_page => {
        this.top_page = top_page;
        //console.log(top_page);
      });
    this.staffService.getTagData(this.tagsURL)
      .subscribe(tags => {
        this.tags = tags;
        //console.log(tags);
      });
    
    this.staffService.getSubpageData(this.subpageURL)
      .subscribe(subpage => {
        this.subpage = subpage;
      });
    this.staffService.getConnectTags(this.connectionURL)
      .subscribe(connect_tags => {
        this.connect_tags = connect_tags;
        //console.log(connect_tags);
      });
  }

  addQueryParams(query): void {
    const keys = Object.keys(query);
    this.tagid = Object.values(query);
    //console.log(query);
    this._router.navigate([''], {
        queryParams: {
          ...query
        },
        queryParamsHandling: 'merge',
      });
  }



}

