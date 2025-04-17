document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const startButton = document.getElementById('start-button');
    const scanImageButton = document.getElementById('scan-image-button');
    const imageUpload = document.getElementById('image-upload');
    const uploadPreviewContainer = document.getElementById('upload-preview-container');
    const uploadPreview = document.getElementById('upload-preview');
    const resultContainer = document.getElementById('result-container');
    const barcodeResult = document.getElementById('barcode-result');
    const productInfo = document.getElementById('product-info');
    const co2Value = document.getElementById('co2-value');
    const co2Bar = document.getElementById('co2-bar');
    const co2Comparison = document.getElementById('co2-comparison');
    const scanHistory = document.getElementById('scan-history');
    const loadingSpinner = document.getElementById('loading-spinner');
    
    // Initialize scanner
    let scannerIsRunning = false;
    const scanner = initScanner(handleBarcodeDetection);
    
    // Event listeners
    startButton.addEventListener('click', toggleScanner);
    scanImageButton.addEventListener('click', scanUploadedImage);
    imageUpload.addEventListener('change', handleImageUpload);
    
    // Tab change handler - stop scanner when switching tabs
    document.querySelectorAll('button[data-bs-toggle="tab"]').forEach(function(tab) {
        tab.addEventListener('shown.bs.tab', function(event) {
            if (scannerIsRunning) {
                scanner.stop();
                startButton.textContent = 'Start Scanner';
                scannerIsRunning = false;
            }
        });
    });
    
    // Functions
    function toggleScanner() {
        if (scannerIsRunning) {
            scanner.stop();
            startButton.textContent = 'Start Scanner';
            scannerIsRunning = false;
        } else {
            startScanner();
        }
    }
    
    async function startScanner() {
        try {
            await scanner.start(document.querySelector('#interactive'));
            startButton.textContent = 'Stop Scanner';
            scannerIsRunning = true;
            resultContainer.classList.remove('d-none');
        } catch (error) {
            barcodeResult.textContent = "Error starting scanner: " + error;
        }
    }
    
    function handleBarcodeDetection(code) {
        barcodeResult.textContent = `Barcode detected: ${code}`;
        loadingSpinner.classList.remove('d-none');
        fetchProductInfo(code);
    }
    
    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadPreview.src = e.target.result;
            uploadPreviewContainer.classList.remove('d-none');
        };
        reader.readAsDataURL(file);
    }
    
    async function scanUploadedImage() {
        if (!uploadPreview.src) {
            barcodeResult.textContent = "Please upload an image first";
            return;
        }
        
        try {
            barcodeResult.textContent = "Scanning image...";
            resultContainer.classList.remove('d-none');
            loadingSpinner.classList.remove('d-none');
            
            const code = await scanner.scanImage(uploadPreview);
            barcodeResult.textContent = `Barcode detected: ${code}`;
            
            await fetchProductInfo(code);
        } catch (error) {
            console.error('Error scanning image:', error);
            barcodeResult.textContent = `Error: ${error}`;
            loadingSpinner.classList.add('d-none');
        }
    }
    
    async function fetchProductInfo(barcode) {
        try {
            const data = await productDataService.fetchProductData(barcode);
            displayProductInfo(data);
            addToScanHistory(data);
            loadingSpinner.classList.add('d-none');
        } catch (error) {
            console.error('Error fetching product data:', error);
            productInfo.innerHTML = `<p class="text-danger">Error fetching product data</p>`;
            loadingSpinner.classList.add('d-none');
        }
    }
    
    function displayProductInfo(data) {
        // Display product information
        productInfo.innerHTML = `
            <p class="fw-bold">${data.name}</p>
            <p class="text-muted small">${data.brand}</p>
            <p class="small">Category: ${data.category}</p>
            <p class="small">Weight: ${data.weight}</p>
        `;
        
        // Display CO2 information
        co2Value.textContent = `${data.co2Impact} kg CO2e`;
        co2Value.className = getCO2ImpactClass(data.co2Impact);
        
        // Set bar width and color
        const percentage = Math.min(data.co2Impact * 10, 100);
        co2Bar.style.width = `${percentage}%`;
        co2Bar.className = `progress-bar ${getCO2BarColorClass(data.co2Impact)}`;
        co2Bar.setAttribute('aria-valuenow', percentage);
        
        // Set comparison text
        co2Comparison.textContent = data.comparison;
    }
    
    function getCO2ImpactClass(co2Value) {
        if (co2Value < 1) return "fw-bold text-success";
        if (co2Value < 3) return "fw-bold text-warning";
        return "fw-bold text-danger";
    }
    
    function getCO2BarColorClass(co2Value) {
        if (co2Value < 1) return "bg-success";
        if (co2Value < 3) return "bg-warning";
        return "bg-danger";
    }
    
    function addToScanHistory(data) {
        // Clear "No recent scans" if it exists
        if (scanHistory.children.length === 1 && 
            scanHistory.children[0].textContent === "No recent scans") {
            scanHistory.innerHTML = "";
        }
        
        // Add new scan to history
        const historyItem = document.createElement('li');
        historyItem.className = "list-group-item d-flex justify-content-between";
        historyItem.innerHTML = `
            <span>${data.name}</span>
            <span class="${getCO2ImpactClass(data.co2Impact)}">${data.co2Impact} kg CO2e</span>
        `;
        
        // Add to the top of the list
        scanHistory.prepend(historyItem);
        
        // Keep only the latest 5 scans
        if (scanHistory.children.length > 5) {
            scanHistory.removeChild(scanHistory.lastChild);
        }
    }
});