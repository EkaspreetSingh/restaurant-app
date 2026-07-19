import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  coreValues = [
    {
      icon: '🌿',
      title: 'Fresh Ingredients',
      description: 'We source the finest seasonal produce and artisan spices, ensuring every dish bursts with authentic, vibrant flavour.'
    },
    {
      icon: '🔥',
      title: 'Artisan Craft',
      description: 'Our chefs blend time-honoured Indian techniques with modern culinary innovation to create dishes that are truly extraordinary.'
    },
    {
      icon: '✨',
      title: 'Warm Hospitality',
      description: 'Every guest is family. We craft an atmosphere of refined elegance where you feel welcomed, celebrated, and at home.'
    },
    {
      icon: '♻️',
      title: 'Sustainable Sourcing',
      description: 'From farm to table, we champion ethical partnerships and eco-conscious practices that honour the land and its people.'
    }
  ];

 teamMembers = [
  {
    name: 'Chef Jasmine Sharma',
    role: 'Lead Chef',
    bio: 'With years of culinary experience, Chef Jasmine brings exceptional expertise to the team, having previously served as the Lead Chef at Chat Di Hatti.',
    image: 'assets/images/chef-jasmine.jpg'
  },
  {
    name: 'Unknown Chef',
    role: 'Chef',
    bio: 'Chef at Kimaya\'s Kitchen.',
    image: 'assets/images/unknown-chef-1.jpg'
  },
  {
    name: 'Unknown Chef',
    role: 'Chef',
    bio: 'Chef at Kimaya\'s Kitchen.',
    image: 'assets/images/unknown-chef-2.jpg'
  }
];
}
