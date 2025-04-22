import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeParticipanteComponent } from './home-participante.component';

describe('HomeParticipanteComponent', () => {
  let component: HomeParticipanteComponent;
  let fixture: ComponentFixture<HomeParticipanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeParticipanteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeParticipanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
