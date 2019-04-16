// editpage.components.ts

import { Component, OnInit, Input, ViewChild, ViewChildren } from '@angular/core';
import { DomSanitizer,  } from '@angular/platform-browser';
import { Page, Tags, assoc_top_tag, SubPage } from '../datatables/page';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIService } from '../api.service';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AppComponent } from '../app.component';

import { PageComponent } from '../page/page.component';
import { identifierModuleUrl } from '@angular/compiler';

@Component({
  selector: 'app-editpage',
  templateUrl: './editpage.component.html',
  styleUrls: ['./editpage.component.css']
})

@Injectable({
  providedIn: 'root'
})

export class EditpageComponent implements OnInit {
  public tags: any;
  public tag = null;
  public searchTerm = null;
  public tagname: any;

  public title; 
  public description;
  public icon;
  public sidebar;
  public isactive;
  public active: boolean;
  public pageT;
  public pageD;
  public pageI;
  public pageA;
  public pageS;

  url: string;
  top_page: Page[];
  top_category: Page;
  tagsArray: Tags[];
  subpage: SubPage[];
  subpageitems: SubPage[];
  connect_tags: assoc_top_tag[];



  @ViewChildren('nGForArray') filtered;
  public subsearchTerm = null;
  public topTitle;
  public queryStrings;

    
  //completePerson: PersonPage[];
  router: RouterLink;

  constructor(
    private staffService: APIService,
    private mainApp: AppComponent,
    private http: HttpClient,
    protected sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private _router: Router,
    private location: Location
  ) { }

  ngOnInit() {
    this.getParams();
    this.getData();
    
  }

  getData(): any {
    //console.log(this.baseURL);
    this.staffService.getPageData(this.mainApp.internal_db)
      .subscribe(top_page => {
        this.top_page = top_page;
        console.log(this.top_page);
        this.staffService.getSubpageData(this.mainApp.internal_db)
          .subscribe(subpage => {
            this.subpage = subpage;
            this.subpageitems = subpage;
          });
      });
    this.staffService.getTagData(this.mainApp.internal_db)
      .subscribe(tagArray => {
        this.tagsArray = tagArray;
      });
    
    this.staffService.getConnectTags(this.mainApp.internal_db)
      .subscribe(connect_tags => {
        this.connect_tags = connect_tags;
        //console.log(connect_tags);
      });
  }

  getParams(): void {
    this.route.queryParamMap.subscribe(params => {
      const queryStrings: any = this.route.queryParamMap;
      this.executeQueryParams(queryStrings.source.value);
    });
  }

  getTags(page): string {
    var pagetags = "";
    if (page.tags) {
      for (let i = 0; i < page.tags.length; i++) {
        pagetags = pagetags + (page.tags[i].tag);
        if (page.tags[i + 1]) {
          pagetags = pagetags + ", ";
        }
      }
    }
    return pagetags;
  }

  clickTag(tag: string): void {
    console.log(tag);
  }

  addQueryParams(query): void {
    const keys = Object.keys(query);
    const values = Object.values(query);
    for (let i = 0; i < keys.length; i++) {
      switch (keys[i]) {
        case 'tag':
          this.tag = values[0];
          break;
      }
    }
    if (keys[0] === 'tag') {

      this._router.navigate(['edit'], {
        queryParams: {
          ...query
        }
      });
    } else {
      if (query === "") {
        query = null;
      }
      this._router.navigate(['edit'], {
          queryParams: {
            ...query
          },
          queryParamsHandling: 'merge',
        });
    }
  }

  executeQueryParams(queryStrings): void {
    const queries = Object.entries(queryStrings);
    this.clearFilters();
    for (const q of queries) {
      switch (q[0]) {
        case 'tag':
          this.tag = q[1];
          break;
        case 'search':
          this.searchTerm = q[1];
          break;

      }
    }
  }

  clearFilters() {
    this.searchTerm = null;
    this.tags = null;
  }

  createRequest(title, description, icon, sidebar, isactive ) {
  
    let newid = this.top_page.length + 1

    if (isactive = "true") {
      this.active = true;
    }
    else this.active = false;
    
    const body = {
      "title": title,
      "description": description,
      "icon": icon,
      "sidebar": sidebar,
      "isactive": isactive,
    };

    console.log(body);
    this.staffService.postPageData(body)
      .subscribe(
        (p: any) => {
          p = this.top_page;
        }
      );
  }

  clearForm(): void {
    this.pageT = '';
    this.pageD = '';
    this.pageI = '';
    this.pageA = '';
    this.pageS = '';
  }

}