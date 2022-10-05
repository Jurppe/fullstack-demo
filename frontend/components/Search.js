/* eslint-disable react/jsx-props-no-spreading */
import { useLazyQuery } from '@apollo/client';
import { resetIdCounter, useCombobox } from 'downshift';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';
import { useRouter } from 'next/router';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';

// Graphql query for finding items from allProducts based on where method
const SEARCH_PRODUCTS_QUERY = gql`
  query SEARCH_PRODUCTS_QUERY($searchTerm: String!) {
    searchTerms: allProducts(
      where: {
        OR: [
          { name_contains_i: $searchTerm }
          { description_contains_i: $searchTerm }
        ]
      }
    ) {
      id
      name
      photo {
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

export default function Search() {
  const router = useRouter();
  // Use useLazyQuery() to execute SEARCH_PRODUCTS_QUERY only when needed, ie. not on render
  const [findItems, { loading, data, error }] = useLazyQuery(
    SEARCH_PRODUCTS_QUERY,
    {
      fetchPolicy: 'no-cache',
    }
  );
  const items = data?.searchTerms || [];
  /**
   * resetIdCounter()
   *
   * Allows reseting the internal id counter which is used to generate unique ids for Downshift component.
   * You should never need to use this in the browser.
   * Only if you are running an universal React app that is rendered on the server
   * you should call resetIdCounter before every render so that the ids that get generated on the server
   * match the ids generated in the browser.
   */
  resetIdCounter();
  // Create debounce function to limit search queries sent to server
  const findItemsButChill = debounce(findItems, 350);
  const {
    getMenuProps,
    getInputProps,
    getComboboxProps,
    getItemProps,
    inputValue,
    highlightedIndex,
    isOpen,
  } = useCombobox({
    items,
    // Function that is executed when the input changes
    onInputValueChange() {
      findItemsButChill({
        variables: {
          searchTerm: inputValue,
        },
      });
    },
    // Function that is executed when item is selected from searchresults
    onSelectedItemChange({ selectedItem }) {
      router.push({
        pathname: `/product/${selectedItem.id}`,
      });
    },
    // How to construct strings from item objects
    itemToString: (item) => item?.name || '',
  });
  return (
    <SearchStyles>
      <div {...getComboboxProps()}>
        <input
          {...getInputProps({
            type: 'search',
            placeholder: 'Search for an item',
            id: 'search',
            className: 'loading',
          })}
        />
      </div>
      <DropDown {...getMenuProps()}>
        {isOpen &&
          items.map((item, index) => (
            <DropDownItem
              key={item.id}
              {...getItemProps({ item })}
              highlighted={index === highlightedIndex}
            >
              <img
                src={item.photo.image.publicUrlTransformed}
                alt={item.name}
                width="50"
              />
              {item.name}
            </DropDownItem>
          ))}
        {isOpen && !items.length && !loading && (
          <DropDownItem>Sorry, no items found for '{inputValue}'</DropDownItem>
        )}
      </DropDown>
    </SearchStyles>
  );
}
