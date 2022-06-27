# Helpers

## Fetch Model from AEM

Helps fetch the model.json from the AEM instance explicitly.This can be useful is SSR scenarios where the model needs to be prefetched prior on server side or prior to ModelManager initialization. 

### Usage

```
const model = await fetchModel({ 
  pagePath: '/content/wknd-app/us/en/home', // path to the page
  itemPath: 'root/responsivegrid' // path to the item within the page for which model is required.
});
```

where _model_ will contain the fetched model of the container at the path _'root/responsivegrid'_ within the page _'/content/wknd-app/us/en/home'_.

You can also directly provide the _cqPath_ of the component for which model needs to be fetched if required.

```
const model = await fetchModel({ 
  cqPath: '/content/wknd-app/us/en/home/jcr:content/root/responsivegrid' // path to the component for which model needs to be fetched
});
```

If the fetch needs to be done prior to ModelManager initialization, you would also have to communicate the host information of the AEM instance from which model is to be fetched as well as any options required for performing the fetch request.

```
const model = await fetchModel({ 
  cqPath: '/content/wknd-app/us/en/home/jcr:content/root/responsivegrid',
  host: ${AEM_HOST},
  options: ${FETCH_REQUEST_OPTIONS}
});
```
