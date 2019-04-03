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
    name: 'tag'
})

export class TagPipe implements PipeTransform {

    transform(items: any[], tag: string): any {
        if (!items || !tag) {
            return items;
        }
        return items.filter(item => item.tag === tag);

    }

}
