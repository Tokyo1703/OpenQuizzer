import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCreadorComponent } from './home-creador.component';

describe('HomeCreadorComponent', () => {
  let component: HomeCreadorComponent;
  let fixture: ComponentFixture<HomeCreadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeCreadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeCreadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
