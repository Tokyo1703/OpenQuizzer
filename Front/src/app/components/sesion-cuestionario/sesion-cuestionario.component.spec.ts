import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SesionCuestionarioComponent } from './sesion-cuestionario.component';

describe('SesionCuestionarioComponent', () => {
  let component: SesionCuestionarioComponent;
  let fixture: ComponentFixture<SesionCuestionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SesionCuestionarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SesionCuestionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
