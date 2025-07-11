// Set map center to Salzburg
var map = L.map('map').setView([47.8000, 13.0400], 14);

// Define base maps
var streets = L.tileLayer('https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=E1MkBYN2ExP7HxidRw8c', {
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
                 '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    maxZoom: 20,
    minZoom: 0
});

var satellite = L.tileLayer('https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=E1MkBYN2ExP7HxidRw8c', {
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
                 '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    maxZoom: 20,
    minZoom: 0
});

// Add default base map
streets.addTo(map);

// Define color schemes for different cuisine categories
var cuisineColors = {
    "Asian": "#E63946",       // قرمز روشن
    "European": "#457B9D",    // آبی آسمانی
    "Vegan/Vegetarian": "#2A9D8F", // سبز دریایی
    "Latin American/Mexican": "#F4A261", // نارنجی
    "Middle Eastern": "#9B5DE5", // بنفش
    "International": "#588157" // سبز جنگلی
};

// Categorize restaurants with more detailed classification
var restaurants = [
    {coordinates: [47.8002674, 13.045302], name: "Spice Garden", cuisine: "indian;thai;international", category: "Asian", veg: "yes"},
    {coordinates: [47.8031766, 13.0467797], name: "Bamboo House", cuisine: "asian", category: "Asian", veg: "yes"},
    {coordinates: [47.8036863, 13.0449625], name: "Pasta e Basta", cuisine: "italian_pizza", category: "European", veg: "no"},
    {coordinates: [47.8034423, 13.045115], name: "Taco Fiesta", cuisine: "mexican", category: "Latin American/Mexican", veg: "no"},
    {coordinates: [47.7997381, 13.0392385], name: "Alpine Delight", cuisine: "austrian", category: "European", veg: "yes"},
    {coordinates: [47.8071885, 13.0015493], name: "Dragon Palace", cuisine: "east_asian", category: "Asian", veg: "no"},
    {coordinates: [47.7979803, 13.0488221], name: "Trattoria Romana", cuisine: "italian", category: "European", veg: "no"},
    {coordinates: [47.7980147, 13.0302833], name: "Aegean Breeze", cuisine: "greek", category: "Middle Eastern", veg: "yes"},
    {coordinates: [47.7731812, 13.0707202], name: "Golden Wok", cuisine: "chinese", category: "Asian", veg: "no"},
    {coordinates: [47.7889688, 13.0367412], name: "Thai Orchid", cuisine: "thai", category: "Asian", veg: "no"},
    {coordinates: [47.8114551, 13.0595557], name: "Pasta Pronto", cuisine: "italian", category: "European", veg: "yes"},
    {coordinates: [47.8032461, 13.0468322], name: "Sakura Sushi", cuisine: "japanese", category: "Asian", veg: "no"},
    {coordinates: [47.7748653, 13.0678221], name: "Pizza Napoli", cuisine: "italian", category: "European", veg: "yes"},
    {coordinates: [47.7974646, 13.0325585], name: "Ristorante Venezia", cuisine: "italian", category: "European", veg: "yes"},
    {coordinates: [47.8003489, 13.0423762], name: "Panda Express", cuisine: "chinese", category: "Asian", veg: "yes"},
    {coordinates: [47.8001529, 13.0429729], name: "Gelato Paradiso", cuisine: "italian", category: "European", veg: "yes"},
    {coordinates: [47.8009881, 13.0389575], name: "Pasta Amore", cuisine: "italian", category: "European", veg: "yes"},
    {coordinates: [47.8031478, 13.0465494], name: "Pizza Express", cuisine: "italian;pizza", category: "European", veg: "no"},
    {coordinates: [47.802277, 13.0666072], name: "Ocean Sushi", cuisine: "asian;sushi;seafood", category: "Asian", veg: "no"},
    {coordinates: [47.80382, 13.047351], name: "Global Bites", cuisine: "burger;italian;chinese", category: "International", veg: "no"}
];

// Create layer groups for each cuisine category
var layerGroups = {};
Object.keys(cuisineColors).forEach(function(category) {
    layerGroups[category] = L.layerGroup();
});

// Store all markers for filtering
var allMarkers = [];

// Add markers to the appropriate layer group with custom icons
restaurants.forEach(function(restaurant) {
    var color = cuisineColors[restaurant.category];
    
    // Custom icon with emoji based on category
    var emoji = '';
    if (restaurant.category === "Asian") emoji = '🍜';
    else if (restaurant.category === "European") emoji = '🍝';
    else if (restaurant.category === "Vegan/Vegetarian") emoji = '🌱';
    else if (restaurant.category === "Latin American/Mexican") emoji = '🌶';
    else if (restaurant.category === "Middle Eastern") emoji = '🥙';
    else emoji = '🍽';
    
    var iconHtml = '<div style="position:relative;width:24px;height:24px;">' +
                   '<svg width="24" height="24" viewBox="0 0 24 24">' +
                   '<circle cx="12" cy="12" r="12" fill="' + color + '"/>' +
                   '<text x="12" y="16" font-family="Arial" font-size="12" ' +
                   'text-anchor="middle" fill="white">' + emoji + '</text></svg>';
    
    if (restaurant.veg === "yes") {
        iconHtml += '<div style="position:absolute;bottom:-5px;right:-5px;background:green;' +
                    'color:white;width:12px;height:12px;border-radius:50%;' +
                    'font-size:8px;text-align:center;line-height:12px;">V</div>';
    }
    
    iconHtml += '</div>';
    
    var icon = L.divIcon({
        html: iconHtml,
        className: 'custom-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });
    
    var marker = L.marker(restaurant.coordinates, {icon: icon});
    
    var popupContent = "<div class='restaurant-info'>" + restaurant.name + "</div>" +
                      "<div class='restaurant-info'>Cuisine: " + restaurant.cuisine + "</div>" +
                      "<div class='cuisine-type'>Category: " + restaurant.category + "</div>";
    
    if (restaurant.veg === "yes") {
        popupContent += "<div class='veg-info'>✓ Vegan/Vegetarian options</div>";
    }
    
    marker.bindPopup(popupContent);
    
    // Store restaurant data in marker for filtering
    marker.restaurantData = restaurant;
    allMarkers.push(marker);
    
    // Categorize vegan/vegetarian separately
    if (restaurant.veg === "yes") {
        layerGroups["Vegan/Vegetarian"].addLayer(marker);
    }
    
    // Also add to main category
    layerGroups[restaurant.category].addLayer(marker);
});

// Add layer control to the map
var overlayMaps = {};
Object.keys(cuisineColors).forEach(function(category) {
    overlayMaps[category] = layerGroups[category];
    if (category !== "Vegan/Vegetarian") {
        layerGroups[category].addTo(map); // Add all layers except vegan by default
    }
});

// Define base maps for layer control
var baseMaps = {
    "Street Map": streets,
    "Satellite View": satellite
};

L.control.layers(baseMaps, overlayMaps, {
    collapsed: false,
    position: 'topright'
}).addTo(map);

// Add legend with emoji icons
var legend = L.control({position: 'bottomright'});
legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend');
    
    var categories = Object.keys(cuisineColors);
    for (var i = 0; i < categories.length; i++) {
        var category = categories[i];
        var color = cuisineColors[category];
        
        var emoji = '';
        if (category === "Asian") emoji = '🍜';
        else if (category === "European") emoji = '🍝';
        else if (category === "Vegan/Vegetarian") emoji = '🌱';
        else if (category === "Latin American/Mexican") emoji = '🌶';
        else if (category === "Middle Eastern") emoji = '🥙';
        else emoji = '🍽';
        
        div.innerHTML += 
            '<div style="margin: 5px 0; display: flex; align-items: center;">' +
            '<span style="display:inline-flex;align-items:center;justify-content:center;' +
            'width:20px;height:20px;background:' + color + ';border-radius:50%;' +
            'margin-right:8px;color:white;font-size:12px;">' + emoji + '</span>' +
            '<span>' + category + '</span>' +
            '</div>';
    }
    
    // Add vegan indicator explanation
    div.innerHTML += 
        '<div style="margin: 10px 0 5px 0; font-size: 0.8em; color: #555;">' +
        '<span style="display:inline-flex;align-items:center;justify-content:center;' +
        'width:12px;height:12px;background:green;border-radius:50%;' +
        'margin-right:8px;color:white;font-size:8px;">V</span>' +
        '= Vegan/Vegetarian options' +
        '</div>';
    
    return div;
};
legend.addTo(map);

// Create filter control
var FilterControl = L.Control.extend({
    options: {
        position: 'topleft'
    },
    
    onAdd: function(map) {
        var container = L.DomUtil.create('div', 'filter-control');
        
        // Create filter dropdown
        var filterHtml = '<label for="cuisine-filter">Filter by Cuisine:</label>' +
                        '<select id="cuisine-filter">' +
                        '<option value="all">All Cuisines</option>' +
                        '<option value="indian">Indian</option>' +
                        '<option value="thai">Thai</option>' +
                        '<option value="italian">Italian</option>' +
                        '<option value="pizza">Pizza</option>' +
                        '<option value="mexican">Mexican</option>' +
                        '<option value="austrian">Austrian</option>' +
                        '<option value="chinese">Chinese</option>' +
                        '<option value="japanese">Japanese</option>' +
                        '<option value="sushi">Sushi</option>' +
                        '<option value="greek">Greek</option>' +
                        '<option value="burger">Burger</option>' +
                        '<option value="seafood">Seafood</option>' +
                        '</select>' +
                        '<button id="apply-filter">Apply Filter</button>' +
                        '<button id="reset-filter">Reset</button>';
        
        container.innerHTML = filterHtml;
        
        // Add event listeners
        L.DomEvent.on(container.querySelector('#apply-filter'), 'click', this._applyFilter, this);
        L.DomEvent.on(container.querySelector('#reset-filter'), 'click', this._resetFilter, this);
        
        return container;
    },
    
    _applyFilter: function() {
        var selectedCuisine = document.getElementById('cuisine-filter').value;
        
        // Hide all markers first
        allMarkers.forEach(function(marker) {
            map.removeLayer(marker);
        });
        
        if (selectedCuisine === "all") {
            // Show all markers
            allMarkers.forEach(function(marker) {
                map.addLayer(marker);
            });
        } else {
            // Show only markers that match the selected cuisine
            allMarkers.forEach(function(marker) {
                if (marker.restaurantData.cuisine.includes(selectedCuisine)) {
                    map.addLayer(marker);
                }
            });
        }
    },
    
    _resetFilter: function() {
        document.getElementById('cuisine-filter').value = "all";
        this._applyFilter();
    }
});

// Add filter control to map
map.addControl(new FilterControl());

// Metadata Panel Functionality
const metadataBtn = document.getElementById('metadataBtn');
const metadataPanel = document.getElementById('metadataPanel');
const closeMetadata = document.getElementById('closeMetadata');

metadataBtn.addEventListener('click', function() {
    metadataPanel.classList.toggle('show');
});

closeMetadata.addEventListener('click', function() {
    metadataPanel.classList.remove('show');
});

// Custom Scale Control
L.control.scale({
    position: 'bottomleft',
    maxWidth: 200,
    metric: true,
    imperial: false,
    updateWhenIdle: false,
    className: 'leaflet-control-scale-custom'
}).addTo(map);

// Locate Control
var locateControl = L.Control.extend({
    options: {
        position: 'topleft'
    },
    
    onAdd: function(map) {
        var container = L.DomUtil.create('div', 'leaflet-control-locate');
        var link = L.DomUtil.create('a', '', container);
        link.href = '#';
        link.title = 'Locate me';
        link.innerHTML = '<i class="fas fa-location-arrow"></i>';
        
        L.DomEvent.on(link, 'click', this._locate, this);
        
        return container;
    },
    
    _locate: function(e) {
        L.DomEvent.stop(e);
        
        if (navigator.geolocation) {
            var control = this;
            var container = this.getContainer();
            
            // Add active class
            L.DomUtil.addClass(container, 'active');
            
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    // Remove active class
                    L.DomUtil.removeClass(container, 'active');
                    
                    var latlng = L.latLng(position.coords.latitude, position.coords.longitude);
                    
                    // Remove previous location marker if exists
                    if (control._locationMarker) {
                        map.removeLayer(control._locationMarker);
                    }
                    
                    // Add new location marker with pulse effect
                    control._locationMarker = L.marker(latlng, {
                        icon: L.divIcon({
                            className: 'location-marker',
                            iconSize: [12, 12]
                        }),
                        zIndexOffset: 1000
                    }).addTo(map);
                    
                    // Center map on location with some offset to keep the control visible
                    map.setView(latlng, 16, {
                        animate: true,
                        duration: 1
                    });
                    
                    // Show popup with accuracy info
                    var accuracy = position.coords.accuracy;
                    control._locationMarker.bindPopup(
                        "You are here (accuracy: " + Math.round(accuracy) + " meters)"
                    ).openPopup();
                    
                    // Auto-close popup after 5 seconds
                    setTimeout(function() {
                        map.closePopup();
                    }, 5000);
                },
                function(error) {
                    // Remove active class
                    L.DomUtil.removeClass(container, 'active');
                    
                    var errorMsg;
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            errorMsg = "Location access was denied. Please enable location services in your browser settings.";
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMsg = "Location information is unavailable.";
                            break;
                        case error.TIMEOUT:
                            errorMsg = "The request to get your location timed out.";
                            break;
                        case error.UNKNOWN_ERROR:
                            errorMsg = "An unknown error occurred while trying to get your location.";
                            break;
                    }
                    
                    L.popup()
                        .setLatLng(map.getCenter())
                        .setContent(errorMsg)
                        .openOn(map);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        } else {
            L.popup()
                .setLatLng(map.getCenter())
                .setContent("Geolocation is not supported by your browser")
                .openOn(map);
        }
    }
});

// Add locate control to map
map.addControl(new locateControl());