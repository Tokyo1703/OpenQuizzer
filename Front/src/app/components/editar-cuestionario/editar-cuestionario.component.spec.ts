import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCuestionarioComponent } from './editar-cuestionario.component';

describe('EditarCuestionarioComponent', () => {
  let component: EditarCuestionarioComponent;
  let fixture: ComponentFixture<EditarCuestionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarCuestionarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarCuestionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
