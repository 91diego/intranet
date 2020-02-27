import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.css']
})
export class CrearUsuarioComponent implements OnInit {

  public form = {
    email: null,
    name: null,
    password: null,
    password_confirmation: null
  };

  public error = [];
  constructor(private login: LoginService) { }

  nuevoUsuario() {
    console.log(this.form);
    this.login.crearUsuario(this.form).subscribe(
      data => console.log(this.form),
      error => this.handleError(error)
    );
  }

  ngOnInit() {
  }

  handleError(error) {
    this.error = error.error.errors;
  }

}
