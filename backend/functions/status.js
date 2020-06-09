const rp = require("request-promise");
const htmlToJson = require("html-to-json");


module.exports = async (url, version) => {
    let timeout = 3000;

    return rp({
        uri: url,
        timeout,
        encoding: "latin1",
        method: "GET",
        headers: {
            'User-Agent': 'StreamTitle for Mozilla'
        }
    }).then(async function(body) {
        if(version == 'v1'){
            let filtered = await htmlToJson.parse(body, function() {
                return this.map("td", function($item) {
                    return $item.text();
                });
            });
    
            filtered = [filtered[16], filtered[22], filtered[26], filtered[36]];
    
            let ouvintes = filtered[0].trim();
            ouvintes = ouvintes.split("listeners (");
            ouvintes = ouvintes[1].split("unique)");
    
            let metadata = {
                ouvintes: ouvintes[0].trim() == '' ? 00 : parseInt(ouvintes[0].trim()),
                locutor: filtered[1].trim() == '' ? "Rádio Offline" : filtered[1].trim(),
                programa: filtered[2].trim() == '' ? "Rádio Offline" : filtered[2].trim(),
                musica: filtered[3].trim() == '' ? "Não disponível" : filtered[3].trim()
            };
    
            return metadata;
        }else if(version == 'v2'){
            if(body == undefined){
                return {
                    ouvintes: 0,
                    locutor: "Rádio Offline",
                    programa: "Rádio Offline",
                    musica: "Não disponível",
                };
            }

            body = JSON.parse(body).streams[0];

            let metadata = {
                ouvintes: body.uniquelisteners < 9 ? body.uniquelisteners + 0 : body.uniquelisteners,
                locutor: body.servertitle == '' ? "Rádio Offline" : body.servertitle,
                programa: body.servergenre == '' ? "Rádio Offline" : body.servergenre,
                musica: body.songtitle == '' ? "Não disponível" : body.songtitle,
            };
            
            return metadata;
        }else if(version == 'ice'){
            body = JSON.parse(body);
            if(Array.isArray(body.icestats['source'])) {
                let indice = body.icestats['source'].length - 1;
                
                let locutor = body.icestats['source'][indice]['server_name'];
                let programa = body.icestats['source'][indice]['server_description'];
                let ouvintes = body.icestats['source'][indice]['listeners'];

                return {
                    ouvintes: ouvintes == '' ? 0 : ouvintes,
                    locutor: locutor == '' ? "Rádio Offline" : locutor,
                    programa: programa == '' ? "Rádio Offline" : programa,
                    musica: "Não disponível - Ice", 
                }
            }else if(typeof body.icestats['source'] === 'object'){
                let locutor = body.icestats['source'].server_name;
                let programa = body.icestats['source'].server_description;
                let ouvintes = body.icestats['source'].listeners;

                return {
                    ouvintes: ouvintes == '' ? 0 : ouvintes,
                    locutor: locutor == '' ? "Rádio Offline" : locutor,
                    programa: programa == '' ? "Rádio Offline" : programa,
                    musica: "Não disponível - Ice", 
                }
            }
        }
    }).catch((err) => {
        console.log(err);
        
        return {
            ouvintes: 0,
            locutor: "Rádio Offline",
            programa: "Rádio Offline",
            musica: "Não disponível",
        }
    });
};