import { Pipe, PipeTransform } from '@angular/core';
import { CompileShallowModuleMetadata } from '@angular/compiler';

@Pipe({
    name: 'search'
})
export class SearchPipe implements PipeTransform {

    transform(items: any[], search: string): any {
        if (!items || !search) {
            return items;
        }
        const regExp = new RegExp(search, 'gi');
        const check = p => {
            return regExp.test(p.title) ||
                regExp.test(p.description) ||
                regExp.test(p.sidebar) ;
        };
        return items.filter(check);

    }

}

@Pipe({
    name: 'tags'
})

export class TagPipe implements PipeTransform {

    transform(items: any[], tagname: string): any {
        if (!items || !tagname) {
            return items;
        }
        return items.filter(item => item.tagname === tagname);

    }

}
