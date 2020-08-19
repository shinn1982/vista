import { Injectable } from '@angular/core';
import { Md5 } from '../../../assets/md5';
import { HttpService } from '../services/httpService';
import { CommonService } from '../services/common.service';
import * as _ from 'lodash';

const FUNCTION_TYPE_DIC = [
    { type: 0, hashedType: Md5.hashStr(`license_type_0`).toString() },
    { type: 1, hashedType: Md5.hashStr(`license_type_1`).toString() },
    { type: 2, hashedType: Md5.hashStr(`license_type_2`).toString() }
];

@Injectable({
    providedIn: 'root'
})
export class LicenseService {

    constructor(private http: HttpService, private commonService: CommonService) { }

    public check() {
        return this.http.put('/license', { action: 'check' });
    }

    public setFunctionType(type) {
        const hashedType = Md5.hashStr(`license_type_${type}`).toString();
        localStorage.setItem('func_type', hashedType);
    }

    public getFuncionType() {
        const typeFromStorage = localStorage.getItem('func_type');
        const matched = _.find(FUNCTION_TYPE_DIC, ['hashedType', typeFromStorage]);
        return matched ? matched.type : -1;
    }

    public setClientName(name) {
        localStorage.setItem('client_name', name);
    }

    public getClientName() {
        return localStorage.getItem('client_name');
    }
}
