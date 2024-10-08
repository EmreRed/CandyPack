class Subdomain {

    create(subdomain){
        log(subdomain)
        let domain = subdomain.split('.');
        subdomain = subdomain.trim().split('.');
        if(subdomain.length < 3) return Candy.Api.result(false, __('Invalid subdomain name.'));
        if(Candy.config.websites[domain.join('.')]) return Candy.Api.result(false, __('Domain %s already exists.', domain.join('.')));
        while(domain.length > 2){
            domain.shift();
            if(Candy.config.websites[domain.join('.')]){
                domain = domain.join('.');
                break;
            }
        }
        if(typeof domain == 'object') return Candy.Api.result(false, __('Domain %s not found.', domain.join('.')));
        subdomain = subdomain.join('.').substr(0, subdomain.join('.').length - domain.length - 1);
        let fulldomain = [subdomain, domain].join('.');
        if(Candy.config.websites[domain].subdomain.includes(subdomain)) return Candy.Api.result(false, __('Subdomain %s already exists.', fulldomain));
        DNS.record({name: subdomain,          type: 'A'});
        DNS.record({name: 'www.' + subdomain, type: 'CNAME'});
        DNS.record({name: subdomain,          type: 'MX'});
        let websites = Candy.config.websites;
        websites[domain].subdomain.push(fulldomain);
        websites[domain].subdomain.push("www." + fulldomain);
        websites[domain].subdomain.sort();
        Candy.config.websites = websites;
        Candy.SSL.renew(domain);
        return Candy.Api.result(true, __('Subdomain %s created successfully for domain %s.', fulldomain, domain));
    }

}

module.exports = new Subdomain();