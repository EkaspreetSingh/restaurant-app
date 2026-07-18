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
      name: 'Chef Arjun Malhotra',
      role: 'Executive Chef & Founder',
      bio: 'With over two decades of culinary mastery spanning Michelin-starred kitchens in Mumbai, London, and New York, Chef Arjun brings a rare alchemy of tradition and avant-garde technique to every plate.',
      image: 'assets/images/chef-arjun.jpg'
    },
    {
      name: 'Priya Sharma',
      role: 'Head Pastry Chef',
      bio: 'Trained at Le Cordon Bleu and inspired by her grandmother\'s mithai recipes, Priya weaves Indian heritage into exquisite desserts that are as beautiful as they are unforgettable.',
      image: 'assets/images/chef-priya.jpg'
    },
    {
      name: 'Rohan Kapoor',
      role: 'Sous Chef',
      bio: 'A rising star with a passion for molecular gastronomy, Rohan transforms classic Indian comfort food into immersive multi-sensory experiences that delight and surprise.',
      image: 'assets/images/chef-rohan.jpg'
    }
  ];
}
