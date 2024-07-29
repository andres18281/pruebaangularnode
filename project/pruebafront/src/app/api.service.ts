import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

   //private apiUrl = 'https://www.strategic-innovate-solutions.com:3000/send-email'; // Cambia esta URL a tu API real
   private apiUrl = 'http://127.0.0.1:3002/bp/products';
   //private apiUrl = 'https://54.145.8.250:3000/api/send-email';
   //private apiUrl = 'http://localhost:3000/send-email'; // Cambia esta URL a tu API real
   constructor(private http: HttpClient) { }
 
  
 
   // Método GET
   /*
   getData(endpoint: string): Observable<any> {
     return this.http.get(`${this.apiUrl}/${endpoint}`);
   }*/
 
   // Método POST
   postData(data: any): Observable<any> {
     return this.http.post(`${this.apiUrl}`, data);
   }

   getAllData(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
   }

   getDataById(id:string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
   }

   EditData(id:string,data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
   }

   Delete(id:string){
    return this.http.delete(`${this.apiUrl}/${id}`);
   }

   ValidateId(id:string){
    return this.http.get(`${this.apiUrl}/verification/${id}`);
   }
 
}
