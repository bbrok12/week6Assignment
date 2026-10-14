var Main;

// Assuming you're using a bundler or ES module-compatible environment

import Map from "https://js.arcgis.com/5.1/@arcgis/core/Map.js";
import Graphic from "https://js.arcgis.com/5.1/@arcgis/core/Graphic.js";
import GraphicsLayer from "https://js.arcgis.com/5.1/@arcgis/core/layers/GraphicsLayer.js";
import ElevationLayer from "https://js.arcgis.com/5.1/@arcgis/core/layers/ElevationLayer.js";
import SceneView from "https://js.arcgis.com/5.1/@arcgis/core/views/SceneView.js";
import DefaultUI from "https://js.arcgis.com/5.1/@arcgis/core/views/ui/DefaultUI.js";
import MapView from "https://js.arcgis.com/5.1/@arcgis/core/views/MapView.js";

Main = (function () {
    const layer = new ElevationLayer({
        url: "http://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer"
    });
    const map = new Map({
        basemap: "osm-3d",
        ground: {
            layers: [layer]
        },
    });

    const view = new SceneView({
        container: "map",
        viewingMode: "global",
        map: map,
        camera: {
            position: {
                x: -105.503,
                y: 44.270,
                z: 20000000,
                spatialReference: {
                    wkid: 4326

                }
            },
            heading: 0,
            tilt: 0
        },
        popup: {
            dockEnabled: true,
            dockOptions: {
                breakpoint: false
            }
        },
        // enable shadows to be cast from the features
        environment: {
            lighting: {
                directShadowsEnabled: true
            }
        }
    });


    const initMap = function () {

        const graphicsLayer = new GraphicsLayer();
        map.add(graphicsLayer);

        // need to write my own code here this was AI I could not find this in SDK documetentation.
        view.on("click", function (event) {
            view.hitTest(event).then(function (response) {
                const marker = response.results.find(function (result) {
                    return result.graphic && result.graphic.layer === graphicsLayer;
                });

                if (marker) {
                    view.goTo({ target: marker.graphic.geometry, zoom: 12, tilt: 80 }, { duration: 1000 }).catch(function (error) {
                        if (error.name !== "AbortError") {
                            console.error("Could not zoom to marker: ", error.message);
                        }
                    });
                }
            }).catch(function (error) {
                console.error("Could not check clicked map location: ", error.message);
            });
        });


        // toDO alter the symbology of the point symbols changed outline color
        // toDO alter the popup template
        // toDO add a function to zoom to the point when the popup is clicked
        // create a clusturing efect for point symbols when they are near eachother there is no native clustering in the arcgis api for javascript 5.1 so you will have to implement your own clustering algorithm
        // will need to come up with a custom clustering algorithm????????

        // implement a search bar

        for (const [key, value] of Object.entries(myStuff)) {
            console.log(key, value)

            const point = {
                type: "point",
                x: value.coord[0],
                y: value.coord[1],
                z: 10000
            };
            //altered the symbology line width and marker color, per project requirements. 
            const markerSymbol = {
                type: "simple-marker",
                color: [255, 0, 255],
                outline: {

                    // autocasts as new SimpleLineSymbol()                              
                    color: [50, 50, 50],
                    width: 2

                }
            };


            //altered the popup per project requirements
            const pointGraphic = new Graphic({
                geometry: point,
                symbol: markerSymbol,
                popupTemplate: {
                    title: key,
                    content: "<br><b> this is the city: </b>" + value.city + "<br><b> this is the country: </b>" + value.country
                },

            });

            graphicsLayer.add(pointGraphic);



        }


    }

    initMap()

    return {};


})();




