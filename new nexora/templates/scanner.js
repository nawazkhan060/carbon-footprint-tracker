function initScanner(onBarcodeDetected) {
    return {
        start: function(targetElement) {
            return new Promise((resolve, reject) => {
                Quagga.init({
                    inputStream: {
                        name: "Live",
                        type: "LiveStream",
                        target: targetElement,
                        constraints: {
                            facingMode: "environment"
                        },
                    },
                    decoder: {
                        readers: ["ean_reader", "ean_8_reader", "upc_reader", "upc_e_reader"]
                    }
                }, function(err) {
                    if (err) {
                        console.error(err);
                        reject(err);
                        return;
                    }
                    
                    Quagga.start();
                    
                    Quagga.onDetected(function(result) {
                        const code = result.codeResult.code;
                        onBarcodeDetected(code);
                    });
                    
                    resolve();
                });
            });
        },
        
        stop: function() {
            Quagga.stop();
        },
        
        scanImage: function(imageElement) {
            return new Promise((resolve, reject) => {
                Quagga.decodeSingle({
                    decoder: {
                        readers: ["ean_reader", "ean_8_reader", "upc_reader", "upc_e_reader"]
                    },
                    locate: true,
                    src: imageElement.src
                }, function(result) {
                    if (result && result.codeResult) {
                        resolve(result.codeResult.code);
                    } else {
                        reject("No barcode found in image");
                    }
                });
            });
        }
    };
}

