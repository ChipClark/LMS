// editpage.components.ts

import { Component, OnInit, Input, ViewChild, ViewChildren } from '@angular/core';
import { DomSanitizer,  } from '@angular/platform-browser';
import { Page, Tags, assoc_top_tag, SubPage } from '../datatables/page';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIService } from '../api.service';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AppComponent } from '../app.component';

import { PageComponent } from '../page/page.component';
import { identifierModuleUrl } from '@angular/compiler';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';

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

  public top_id;
  public title; 
  public description;
  public icon;
  public sidebar;
  public isactive;
  public active: boolean;
  public pageTitle;
  public pageDescription;
  public pageIcon;
  public pageIsactive;
  public pageSidebar;

  private isPageFormVisible = false;
  public isCurrent = false;

  url: string;
  top_page: Page[];
  single_page: Page;
  top_category: Page;
  tagsArray: Tags[];
  subpage: SubPage[];
  subpageitems: SubPage[];
  connect_tags: assoc_top_tag[];
  iOptions: string[] = [
    "pe-7s-album",
    "pe-7s-arc",
    "pe-7s-back-2",
    "pe-7s-bandaid",
    "pe-7s-car",
    "pe-7s-diamond",
    "pe-7s-door-lock",
    "pe-7s-eyedropper",
    "pe-7s-female",
    "pe-7s-gym",
    "pe-7s-hammer",
    "pe-7s-headphones",
    "pe-7s-helm",
    "pe-7s-hourglass",
    "pe-7s-leaf",
    "pe-7s-magic-wand",
    "pe-7s-male",
    "pe-7s-map-2",
    "pe-7s-next-2",
    "pe-7s-paint-bucket",
    "pe-7s-pendrive",
    "pe-7s-photo",
    "pe-7s-piggy",
    "pe-7s-plugin"
    
  ];

  formPage: FormGroup; 


  @ViewChildren('nGForArray') filtered;
  @ViewChildren('formPage') formValues;
  public subsearchTerm = null;
  public topTitle;
  public queryStrings;

    
  //completePerson: PersonPage[];
  router: RouterLink;

  constructor(
    private apiService: APIService,
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
    this.setForm();
    
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

  clearFilters() {
    this.searchTerm = null;
    this.tags = null;
  }

  clearForm(currentForm: Page): void {
    console.log(currentForm);
    this.formValues.reset;
    this.pageDescription = "";
    this.pageTitle = "";
    this.pageIcon = "";
    this.pageIsactive = null;
    this.pageSidebar = "";
    console.log(this.formValues);

  }

  clickTag(tag: string): void {
    console.log(tag);
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
    this.apiService.postPageData(body)
      .subscribe(
        (p: any) => {
          p = this.top_page;
        }
      );
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

  fillform(single_page): void {
    this.isPageFormVisible = true;
    this.title = single_page.title;
    this.description = single_page.description;
    this.icon = single_page.icon;
    this.isactive = single_page.isactive;
    this.sidebar = single_page.sidebar;
    this.top_id = single_page.top_id
    this.isCurrent = true;
  }


  
  getData(): any {
    //console.log(this.baseURL);
    this.apiService.getPageData(this.mainApp.internal_db)
      .subscribe(top_page => {
        this.top_page = top_page;
        this.apiService.getSubpageData(this.mainApp.internal_db)
          .subscribe(subpage => {
            this.subpage = subpage;
            this.subpageitems = subpage;
          });
      });
    this.apiService.getTagData(this.mainApp.internal_db)
      .subscribe(tagArray => {
        this.tagsArray = tagArray;
      });
    
    this.apiService.getConnectTags(this.mainApp.internal_db)
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

  setForm(): void {
    this.formPage = new FormGroup({
      pageTitle: new FormControl(),
      pageDescription: new FormControl(),
      pageIcon: new  FormControl(),
      pageIsactive: new FormControl(),
      pageSidebar: new FormControl()

    });
  }

  showForm(): void {

  }

  updatePreview(icon: string): void {
    console.log(icon);
    //document.getElementById("preview").classList
  }

  
}