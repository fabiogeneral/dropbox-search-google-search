/* Component Documentation:
  Required installation of following package dependencies
    npm i react-select
    npm i node-sass
    npm i debounce-promise
*/

import React from 'react';
import debounce from 'debounce-promise';
import AsyncSelect from 'react-select/async';
import axios from 'axios';
import './dropbox_search.scss';

const DropboxSearch = ({ setUrl }) => {
  // Get the options that will be displayed on Dropbox Menu
  const getSearchOptions = debounce(
    // Consider each character typed on input field returning the promisse
    predicate => {
      // console.log(predicate);
      return new Promise(resolve => {
        const google_api_key = 'AIzaSyAsX2J7gLldme4j3CN_fgfYFC5tklMoFaU';
        resolve(
          // Fetch Custom Search Google API using predicate
          axios({
            method: 'GET',
            url: `https://www.googleapis.com/customsearch/v1?key=${google_api_key}`,
            params: {
              cx: '017576662512468239146:omuauf_lfve',
              q: predicate
            }
          })
            .then(response => {
              // Retrieve items coming from search result
              const { items } = response.data;
              // console.log(items);
              // Map through results to create options array
              return items.map(e => ({ value: e.link, label: e.title }));
            })
            .catch(error => [{ value: '', label: error.response }])
          /* It needs to retun a array of objects,
           containing value and label inside of each the object */
          // [{ value: '1', label: predicate }] // Required
          // It is possible to async call REST API and return array of results
        );
      });
    },
    500,
    {
      leading: false
    }
  );

  const setRecentSearch = input => {
    // Check if there is value and do next action
    input.value && console.log('[add action]'); // Required
    /* It is possible to async post {input} on a REST API
       to also be called after on getSearchOptions()
       or even on local state */
  };

  return (
    <div className="base">
      <AsyncSelect
        type="text"
        className="select"
        components={{
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null
        }}
        autoLoad={false} // default is true, to call option on page load
        loadOptions={input => getSearchOptions(input)}
        noOptionsMessage={({ input }) => !input && 'Type to search...'}
        placeholder="Type to search..."
        onChange={input => {
          setRecentSearch(input);
          // Set props main state to display url link
          setUrl(input.value);
        }}
      />
    </div>
  );
};

export default DropboxSearch;
