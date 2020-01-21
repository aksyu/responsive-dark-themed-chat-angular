import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Avatar } from '../model/avatar';

import { environment } from '@environments/environment';
const SERVER_URL = environment.server_url;
const API_URL = '/api/';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  public getAvatar(nickname: string) {
    const url = `${SERVER_URL}${API_URL}avatar/${nickname}`;
    return this.httpClient.get<Avatar>(url);
  }
}
