import { Component, inject} from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import { ApiService } from "../api/api.service";
import { AuthService } from "../auth/auth.service";
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatDialog,MatDialogClose } from '@angular/material/dialog';

import { SimpleDialogComponent } from "../simple-dialog/simple-dialog.component";
import { MatIconModule } from '@angular/material/icon';

import { QuickNavService } from '../reuseables/services/quick-nav.service';
import { SpinnerComponent } from '../reuseables/http-loader/spinner.component';


import { loadExternalScript } from "../../helper";

@Component({
  selector: 'app-authentication',
  imports: [ReactiveFormsModule, RouterLink, CommonModule, MatIconModule,SpinnerComponent],
  templateUrl: './login.component.html',
  styleUrl: './authentication.component.css'
})

export class LoginComponent {

  constructor(
    public dialog: MatDialog,
    // public loadLink :loadExternalScript
  ) {}

  quickNav = inject(QuickNavService)




  // authService = inject(AuthService);
  // router = inject(Router);
  // apiService = inject(ApiService);
  //
  history = window.history
  helpLink = "https://t.me/Fanhhh10"

  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

}
