// Mock data — Saints on Go demo
// Vancouver-area coordinates. Routes are simplified polylines for animated buses.

window.SOG_DATA = {
  school: {
    name: "Saint George's Senior School",
    address: '4175 W 29th Ave, Vancouver, BC',
    coords: [49.2487, -123.1869], // school location (UBC-ish)
  },
  buses: [
    {
      id: 'B1',
      number: 'Bus 1',
      route: 'Kitsilano · West Loop',
      driver: 'M. Patel',
      eta: 5,
      capacity: 24,
      onboard: 18,
      status: 'on-route',
      // start → school
      polyline: [
        [49.2734, -123.1532], // Kits Beach
        [49.2680, -123.1610],
        [49.2630, -123.1700],
        [49.2580, -123.1770],
        [49.2530, -123.1820],
        [49.2487, -123.1869], // school
      ],
      stops: [
        { name: 'Kits Beach', time: '7:45 AM', done: true },
        { name: 'Vine & 4th', time: '7:52 AM', done: true },
        { name: 'MacDonald & 16th', time: '7:58 AM', done: false, next: true },
        { name: 'Trafalgar & 22nd', time: '8:04 AM', done: false },
        { name: "Saint George's Senior School", time: '8:10 AM', done: false },
      ],
    },
    {
      id: 'B2',
      number: 'Bus 2',
      route: 'North Shore · Lions Gate',
      driver: 'J. Tran',
      eta: 10,
      capacity: 24,
      onboard: 21,
      status: 'on-route',
      polyline: [
        [49.3200, -123.0720], // North Van
        [49.3100, -123.0900],
        [49.3000, -123.1100],
        [49.2900, -123.1300],
        [49.2800, -123.1500],
        [49.2700, -123.1700],
        [49.2487, -123.1869],
      ],
      stops: [
        { name: 'Lonsdale Quay', time: '7:35 AM', done: true },
        { name: 'Capilano Mall', time: '7:44 AM', done: true },
        { name: 'Lions Gate Br.', time: '7:55 AM', done: false, next: true },
        { name: 'Park Royal', time: '8:02 AM', done: false },
        { name: "Saint George's Senior School", time: '8:15 AM', done: false },
      ],
    },
    {
      id: 'B3',
      number: 'Bus 3',
      route: 'East Van · Commercial',
      driver: 'R. Singh',
      eta: 15,
      capacity: 24,
      onboard: 14,
      status: 'departing',
      polyline: [
        [49.2680, -123.0700], // Commercial Dr
        [49.2620, -123.0850],
        [49.2580, -123.1050],
        [49.2540, -123.1300],
        [49.2510, -123.1550],
        [49.2487, -123.1869],
      ],
      stops: [
        { name: 'Commercial & 1st', time: '7:50 AM', done: true, next: true },
        { name: 'Main & Broadway', time: '7:58 AM', done: false },
        { name: 'Cambie & King Ed', time: '8:08 AM', done: false },
        { name: 'Oak & 41st', time: '8:14 AM', done: false },
        { name: "Saint George's Senior School", time: '8:20 AM', done: false },
      ],
    },
  ],
  scheduleDays: [
    { label: 'Today', date: 'Tue, May 27', runs: [
      { time: '7:35 AM', bus: 'Bus 2', route: 'North Shore', status: 'In transit' },
      { time: '7:45 AM', bus: 'Bus 1', route: 'Kitsilano', status: 'In transit' },
      { time: '7:50 AM', bus: 'Bus 3', route: 'East Van', status: 'Departing' },
      { time: '3:15 PM', bus: 'Bus 1', route: 'Kitsilano (PM)', status: 'Scheduled' },
      { time: '3:15 PM', bus: 'Bus 2', route: 'North Shore (PM)', status: 'Scheduled' },
      { time: '3:15 PM', bus: 'Bus 3', route: 'East Van (PM)', status: 'Scheduled' },
    ]},
    { label: 'Tomorrow', date: 'Wed, May 28', runs: [
      { time: '7:35 AM', bus: 'Bus 2', route: 'North Shore', status: 'Scheduled' },
      { time: '7:45 AM', bus: 'Bus 1', route: 'Kitsilano', status: 'Scheduled' },
      { time: '7:50 AM', bus: 'Bus 3', route: 'East Van', status: 'Scheduled' },
    ]},
  ],
  student: {
    name: 'Sheja Rubayi',
    grade: 'Grade 5',
    bus: 'Bus 1',
    pickup: 'MacDonald & 16th',
  },
};
