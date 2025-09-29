document.addEventListener('DOMContentLoaded', function() {

    const width = window.innerWidth;
    const height = window.innerHeight;

    const svg = d3.select("#neural-web")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Color scales based on node type
    const color = d3.scaleOrdinal()
        .domain(["core", "project", "skill"])
        .range(["#ff00ff", "#00ffff", "#ffffff"]);

    const detailsPanel = document.getElementById('details-panel');
    const closeBtn = document.getElementById('close-btn');

    d3.json("data.json").then(function(graph) {
        const simulation = d3.forceSimulation(graph.nodes)
            .force("link", d3.forceLink(graph.links).id(d => d.id).distance(100))
            .force("charge", d3.forceManyBody().strength(-200))
            .force("center", d3.forceCenter(width / 2, height / 2));

        const link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(graph.links)
            .enter().append("line")
            .style("stroke", "#ffffff")
            .style("stroke-width", 1);

        const node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("g")
            .data(graph.nodes)
            .enter().append("g")
            .attr("class", "node")
            .call(drag(simulation));

        node.append("circle")
            .attr("r", d => d.radius)
            .attr("fill", d => color(d.type))
            .style("filter", d => `drop-shadow(0 0 5px ${color(d.type)})`);

        node.append("text")
            .text(d => d.label)
            .attr("x", d => d.radius + 5)
            .attr("y", 5)
            .style("fill", "#e0e0e0")
            .style("font-family", "Roboto, sans-serif")
            .style("font-size", "12px");
            
        node.on("click", (event, d) => {
            showDetails(d);
            
            // Highlight connected nodes
            node.style("opacity", 0.3);
            link.style("opacity", 0.1);

            d3.select(event.currentTarget).style("opacity", 1);
            
            graph.links.forEach(l => {
                if (l.source.id === d.id || l.target.id === d.id) {
                    node.filter(n => n.id === l.source.id || n.id === l.target.id).style("opacity", 1);
                    link.filter(link_d => link_d === l).style("opacity", 0.8).style("stroke", "#00ffff");
                }
            });
        });

        simulation.on("tick", () => {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node.attr("transform", d => `translate(${d.x},${d.y})`);
        });

        function drag(simulation) {
            function dragstarted(event) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                event.subject.fx = event.subject.x;
                event.subject.fy = event.subject.y;
            }
            function dragged(event) {
                event.subject.fx = event.x;
                event.subject.fy = event.y;
            }
            function dragended(event) {
                if (!event.active) simulation.alphaTarget(0);
                event.subject.fx = null;
                event.subject.fy = null;
            }
            return d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended);
        }

        function showDetails(d) {
            document.getElementById('details-title').innerText = d.label;
            document.getElementById('details-type').innerText = d.type;

            let content = '';
            if (d.type === 'project') {
                content += `<p>${d.description}</p>`;
                if (d.url && d.url !== '#') {
                    content += `<a href="${d.url}" target="_blank">Live Demo</a>`;
                }
                if (d.github && d.github !== '#') {
                    content += `<a href="${d.github}" target="_blank" style="margin-left: 10px;">GitHub Repo</a>`;
                }
                
                // List related skills
                content += '<h4>Skills Used:</h4><ul>';
                graph.links.forEach(l => {
                    if (l.source.id === d.id && l.target.type === 'skill') {
                        content += `<li>${l.target.label}</li>`;
                    }
                });
                content += '</ul>';

            } else if (d.type === 'skill') {
                 // List related projects
                content += '<h4>Related Projects:</h4><ul>';
                graph.links.forEach(l => {
                    if (l.target.id === d.id && l.source.type === 'project') {
                        content += `<li>${l.source.label}</li>`;
                    }
                });
                content += '</ul>';
            } else { // Core
                content = "<p>The central node representing my portfolio. Explore my projects and skills by clicking on the connected nodes.</p>"
            }

            document.getElementById('details-content').innerHTML = content;
            detailsPanel.classList.remove('hidden');
        }

        closeBtn.addEventListener('click', () => {
            detailsPanel.classList.add('hidden');
            // Reset highlighting
            node.style("opacity", 1);
            link.style("opacity", 0.6).style("stroke", "#ffffff");
        });

    });

});