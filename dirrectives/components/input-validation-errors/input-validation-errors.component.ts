// TODO - add description
import { Component, OnInit, Input} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ValidationService } from '../../services/validation.service';

@Component({
  selector: 'input-validation-errors',
  templateUrl: './input-validation-errors.component.html',
  styleUrls: ['./input-validation-errors.component.scss']
})
export class InputValidationErrorsComponent implements OnInit {

  @Input() form: FormGroup = new FormGroup({});
  
  @Input() fieldName: string = '';

  constructor(
    public validationService: ValidationService
  ) { }

  ngOnInit() {
  }

}
