import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SesionCuestionarioCreadorComponent } from './sesion-cuestionario-creador.component';

describe('SesionCuestionarioCreadorComponent', () => {
  let component: SesionCuestionarioCreadorComponent;
  let fixture: ComponentFixture<SesionCuestionarioCreadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SesionCuestionarioCreadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SesionCuestionarioCreadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
