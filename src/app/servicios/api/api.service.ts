import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginI } from '../../modelos/login.interface';
import { Observable } from 'rxjs';
import { ResponseI } from '../../modelos/response.interface';
import { listaPacientesI } from '../../modelos/listapacientes.interface';
import { PacienteI } from '../../modelos/paciente.interface';
import { EditarPacienteI } from '../../modelos/editarpaciente.interface';
import { outputAst } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url:string = "http://localhost/proyectos/github/curso_apirest/";
  
  constructor(private http:HttpClient) { }
  
  loginByEmail(form:LoginI):Observable<ResponseI>{
    let direccion = this.url + "auth";
    return this.http.post<ResponseI>(direccion,form)
  }

  getAllPatients(page:number):Observable<listaPacientesI[]>{
    let direccion= this.url+"pacientes?page="+page;
    return this.http.get<listaPacientesI[]>(direccion);
  }

  getSinglePacient(id:any):Observable<PacienteI>{
    let direccion= this.url+"pacientes?id="+id;
    return this.http.get<PacienteI>(direccion);
  }

  getStateToken(token:any):Observable<ResponseI>{
    let direccion= this.url+"auth?token="+token;
    return this.http.get<ResponseI>(direccion);
  }

  putPatient(form:EditarPacienteI):Observable<ResponseI>{
    let direccion= this.url+"pacientes";
    return this.http.put<ResponseI>(direccion,form);
  }

  deletePatient(form:EditarPacienteI):Observable<ResponseI>{
    let direccion= this.url+"pacientes";
    let Options = {
      Headers: new HttpHeaders({
        'Content-type':'application/json'
      }),
      body:form
    }
    return this.http.delete<ResponseI>(direccion,Options);
  }

  postPatient(form:EditarPacienteI):Observable<ResponseI>{
    let direccion = this.url + "pacientes";
    return this.http.post<ResponseI>(direccion,form);
  }

  removeToken(){
    let direccion = this.url + "cron/actualizar_token.php";
    return this.http.post(direccion, {}).subscribe(
      (response) => {
        console.log('Success: Token removed successfully.');
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }
}
