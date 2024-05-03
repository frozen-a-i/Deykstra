onload = function () {
    let curr_data, V, src, dst;

    const container = document.getElementById('mynetwork');
    const container2 = document.getElementById('mynetwork2');
    const genNew = document.getElementById('generate-graph');
    const solve = document.getElementById('solve');
    const temptext = document.getElementById('temptext');
    const temptext1 = document.getElementById('temptext1');
    const temptext2 = document.getElementById('temptext2');
    const btnsave = document.getElementById('btnsave');

    const cities = [];
    const weight = [];
    const connections = [];



    function fetchPoints() {


        fetch('http://localhost:3000/api/points')
            .then(response => {
                // Check if the response is successful (status code 200)
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                // Parse the response body as JSON

                return response.json();
            })
            .then(data => {
                // Use the fetched data
                data.forEach(element => {
                    cities.push(element.point_name)

                });
            })
            .catch(error => {
                // Handle any errors that occurred during the fetch operation
                console.error('Fetch error:', error);
            });
    }

    fetchPoints()

    function fetchConnections() {


        fetch('http://localhost:3000/api/connections')
            .then(response => {
                // Check if the response is successful (status code 200)
                if (!response.ok) {
                    throw new Error('Network response was not okkkk');
                }
                // Parse the response body as JSON

                return response.json();
            })
            .then(data => {
                // Use the fetched data
                data.forEach(element => {
                    weight.push(element.weight)
                    connections.push(element)
                });
                console.log(connections)
            })
            .catch(error => {
                // Handle any errors that occurred during the fetch operation
                console.error('Fetch error:', error);
            });

    }
    fetchConnections()
    // initialise graph options
    const options = {
        edges: {
            labelHighlightBold: true,
            font: {
                size: 20
            }
        },
        nodes: {
            font: '12px arial red',
            scaling: {
                label: true
            },
            shape: 'icon',
            icon: {
                face: 'FontAwesome',
                code: '\uf015',
                size: 40,
                color: '#991133',
            }
        }
    };
    // Initialize your network!
    // Network for question graph
    const network = new vis.Network(container);
    network.setOptions(options);
    // Network for result graph
    const network2 = new vis.Network(container2);
    network2.setOptions(options);


    function createData() {
        V = cities.length;

        let nodes = [];
        for (let i = 0; i < cities.length; i++) {
            nodes.push({ id: i, label: cities[i] })
        }
        // Prepares vis.js style nodes for our data
        nodes = new vis.DataSet(nodes);

        // Creating a tree like underlying graph structure
        let edges = [];
        const check = new Set();

        for (let i = 0; i < connections.length; i++) {
            const frompoint = connections[i].from_point_id - 1;

            for (let j = 0; j < connections.length; j++) {
                const topoint = connections[j].to_point_id - 1;

                if (connections[j].from_point_id - 1 == frompoint && !check.has(frompoint)) {

                    console.log(`mana shu ${frompoint} ${connections[j].to_point_id - 1}`)
                    edges.push({ type: 0, from: frompoint, to: topoint, color: 'orange', label: String(weight[j]) });
                }
            }
            check.add(frompoint);
        }


        // Setting the new values of global variables
        src = 0;
        dst = V - 1;
        curr_data = {
            nodes: nodes,
            edges: edges
        };
    }





    genNew.onclick = function () {
        // Create new data and display the data
        createData();
        network.setData(curr_data);
        temptext2.style.display = "none";
        temptext.style.display = "inline";

        container2.style.display = "none";
        temptext1.style.visibility = "visible";

        function selection() {
            const selectElement = document.getElementById('neighbours');
            const selectInitial = document.getElementById('initiall');
            const selectLast = document.getElementById('last');

            console.log(selectInitial)
            let id = 0;
            // Populate select element with cities
            cities.forEach(city => {
                const optionElement = document.createElement('option');
                optionElement.value = id;
                optionElement.textContent = city;
                selectElement.appendChild(optionElement);


                const optionInitial = document.createElement('option');
                optionInitial.value = id;
                optionInitial.textContent = city;
                selectInitial.appendChild(optionInitial);

                // Create option element for last select
                const optionLast = document.createElement('option');
                optionLast.value = id; // Same value as initial select
                id++;
                optionLast.textContent = city;
                selectLast.appendChild(optionLast);
            });
            console.log(selectInitial)
            console.log(selectLast)

        }

        // Call the selection function to populate the select element
        selection();


    };
    btnsave.onclick = function () {


        const speed = parseFloat(document.getElementById('speed').value);
        const distance = parseFloat(document.getElementById('lengt').value);
        const roughness = parseFloat(document.getElementById('roughness').value);
        const capacity = parseFloat(document.getElementById('capacity').value);
        const neighbours = parseInt(document.getElementById('neighbours').value);
        const currentpoint = document.getElementById('manzil').value;

        temptext1.style.visibility = "hidden";
        if (isNaN(distance) || isNaN(roughness) || isNaN(capacity) || isNaN(speed) || isNaN(neighbours)) {


            console.log('One or more input values are not valid numbers.');
            return;
        }

        // Check for division by zero
        if (capacity === 0 || speed === 0) {
            console.log('Division by zero error.');
            return;
        }
        const coefficient = parseFloat(((distance * roughness) / (capacity * speed)).toFixed(2));
        console.log(coefficient)
        fetch('http://localhost:3000/api/connections', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fromPoint: currentpoint, neighbours: cities[neighbours - 1], weight: coefficient }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Backend response:', data);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });


        genNew.click();

    }
    solve.onclick = function () {
        const initial = parseInt(document.getElementById('initiall').value);
        const last = parseInt(document.getElementById('last').value);

        console.log(initial, last)
        src = initial;
        dst = last;
        // Create graph from data and set to display
        temptext.style.display = "none";
        temptext2.innerText = " " + cities[initial + 1] + ' dan ' + cities[last + 1] + " gacha bo'lgan eng optimal yo'l";
        temptext2.style.display = "none";
        container2.style.display = "inline";
        network2.setData(solveData());
    };

    function djikstra(graph, sz) {
        let vis = Array(sz).fill(0);
        let dist = [];
        for (let i = 0; i < sz + 1; i++)
            dist.push([10000, -1]);
        dist[src][0] = 0;

        for (let i = 0; i < sz - 1; i++) {
            let mn = -1;
            for (let j = 0; j < sz; j++) {
                if (vis[j] === 0) {
                    if (mn === -1 || dist[j][0] < dist[mn][0])
                        mn = j;
                }
            }

            vis[mn] = 1;
            for (let j in graph[mn]) {
                let edge = graph[mn][j];
                if (vis[edge[0]] === 0 && dist[edge[0]][0] > dist[mn][0] + edge[1]) {
                    dist[edge[0]][0] = dist[mn][0] + edge[1];
                    dist[edge[0]][1] = mn;
                }
            }
        }

        return dist;
    }
    function createGraph(data) {
        console.log(data)
        let graph = [];
        for (let i = 1; i <= V; i++) {
            graph.push([]);
        }

        for (let i = 0; i < data['edges'].length; i++) {
            let edge = data['edges'][i];
            if (edge['type'] === 1)
                continue;
            graph[edge['to']].push([edge['from'], parseInt(edge['label'])]);
            graph[edge['from']].push([edge['to'], parseInt(edge['label'])]);
        }
        return graph;
    }
    function solveData() {
        console.log('it is done');
        temptext1.style.visibility = 'hidden';


        const data = curr_data

        //     "nodes": {
        //         "_subscribers": {
        //             "*": [],
        //             "add": [
        //                 null,
        //                 null
        //             ],
        //             "remove": [
        //                 null,
        //                 null
        //             ],
        //             "update": [
        //                 null,
        //                 null
        //             ]
        //         },
        //         "length": 4,
        //         "_options": {},
        //         "_data": {},
        //         "_idProp": "id",
        //         "_queue": null
        //     },
        //     "edges": [
        //         {
        //             "type": 0,
        //             "from": 2,
        //             "to": 1,
        //             "color": "orange",
        //             "label": "37",
        //             "id": "1766d5fc-0c65-4fb0-8caa-7f3404f83269"
        //         },
        //         {
        //             "type": 0,
        //             "from": 3,
        //             "to": 2,
        //             "color": "orange",
        //             "label": "81",
        //             "id": "9e0c653c-7fd0-4444-ac29-ec107d0a3d91"
        //         },
        //         {
        //             "type": 0,
        //             "from": 4,
        //             "to": 2,
        //             "color": "orange",
        //             "label": "64",
        //             "id": "fd462a25-eee9-49d5-808c-4b3589a9094d"
        //         },
        //         {
        //             "type": 1,
        //             "from": 3,
        //             "to": 2,
        //             "color": "green",
        //             "label": "36",
        //             "id": "afb600ee-bed0-4260-b129-4110bb77508d"
        //         },
        //         {
        //             "type": 1,
        //             "from": 4,
        //             "to": 3,
        //             "color": "green",
        //             "label": "24",
        //             "id": "51175c2d-b4cc-4bbf-825f-d42ab61871d4"
        //         }
        //     ]
        // }
        console.log(data, 790);
        // Creating adjacency list matrix graph from question data
        const graph = createGraph(data);

        console.log(src, dst, 312421);

        // Applying djikstra from src and dst
        let dist1 = djikstra(graph, V);
        console.log(dist1, dst);
        // let dist2 = djikstra(graph, V, dst - 1);


        let mn_dist = dist1[dst][0];



        let new_edges = [];

        new_edges.push(...pushEdges(dist1, dst, false));

        // }
        const ans_data = {
            nodes: data['nodes'],
            edges: new_edges
        };

        console.log(ans_data);
        return ans_data;
    }

    function pushEdges(dist, curr, reverse) {
        let tmp_edges = [];
        while (dist[curr][0] !== 0) {
            let fm = dist[curr][1];
            if (reverse)
                tmp_edges.push({ arrows: { to: { enabled: true } }, from: curr, to: fm, color: 'orange', label: String(dist[curr][0] - dist[fm][0]) });
            else
                tmp_edges.push({ arrows: { to: { enabled: true } }, from: fm, to: curr, color: 'orange', label: String(dist[curr][0] - dist[fm][0]) });
            curr = fm;
        }
        return tmp_edges;
    }

    genNew.click();


}
