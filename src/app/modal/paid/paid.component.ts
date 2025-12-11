import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import {ReactiveFormsModule} from '@angular/forms';
import {FormGroup, FormControl} from '@angular/forms';

import { ApiService } from "../../api/api.service";
import { AuthService } from "../../auth/auth.service";
import { DataService } from "../../user/data.service";

import { SimpleDialogComponent } from "../../simple-dialog/simple-dialog.component";

import { RouterLink, ActivatedRoute, Router} from '@angular/router';

import { WalletComponent } from "../../wallet/wallet.component";
import {MatButtonModule} from '@angular/material/button';

import { QuickNavService } from '../../reuseables/services/quick-nav.service';
import { WalletService } from '../../reuseables/services/wallet.service';

import {
  MatDialog,
  MatDialogActions,
 } from '@angular/material/dialog';

@Component({
  selector: 'app-paid',
  imports: [ReactiveFormsModule,CommonModule,MatDialogActions,MatButtonModule],
  templateUrl: './paid.component.html',
  styleUrl: '../modal.component.css'
})
export class PaidComponent {

  @Output() closeModal = new EventEmitter<void>();

  close() {this.closeModal.emit();}

  constructor(
    // private route: ActivatedRoute,
    private router: Router,
    private wallet: WalletComponent,
    public dialog: MatDialog
  ) {}

  serviceData = inject(DataService)
  apiService = inject(ApiService)
  authService = inject(AuthService)

  loading = false

  selectedFile: any //File | null = null;

  paymentCompletedForm = new FormGroup({
    senders_name:new FormControl(''),
    transaction_id:new FormControl(''),
    file:new FormControl(null)
  })

  walletService = inject(WalletService)



}
