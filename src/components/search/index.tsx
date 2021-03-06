import React, {FunctionComponent} from 'react'
import Head from 'next/head'
import Hits from './hits'
import SearchBox from './search-box'
import RefinementList from './refinement-list'
import {Configure, Pagination, InstantSearch} from 'react-instantsearch-dom'
import {get, isEqual} from 'lodash'
import {useToggle} from 'react-use'

import config from '@lib/config'

import SearchReact from './react.mdx'

type SearchProps = {
  searchClient: any
  indexName: string
  searchState: any
}

const Search: FunctionComponent<SearchProps> = ({
  children = [],
  searchClient,
  indexName,
  searchState,
  ...rest
}) => {
  const [on, toggle] = useToggle(false)
  const noInstructorsSelected = (searchState: any) => {
    return get(searchState, 'refinementList.instructor_name', []).length === 0
  }

  const noTagsSelected = (searchState: any) => {
    return get(searchState, 'refinementList._tags', []).length === 0
  }

  const onlyTheseTagsSelected = (tags: string[], searchState: any) => {
    const selectedTags = get(
      searchState,
      'refinementList._tags',
      [],
    ) as string[]
    return isEqual(tags, selectedTags)
  }

  const onlyTheseInstructorsSelected = (
    instructors: string[],
    searchState: any,
  ) => {
    const selectedTags = get(
      searchState,
      'refinementList.instructor_name',
      [],
    ) as string[]
    return isEqual(instructors, selectedTags)
  }

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/instantsearch.css@7.3.1/themes/algolia-min.css"
        ></link>
      </Head>
      <InstantSearch
        indexName={indexName}
        searchClient={searchClient}
        searchState={searchState}
        {...rest}
      >
        <Configure hitsPerPage={config.searchResultCount} />

        <main>
          <div>
            <button onClick={toggle}>{on ? 'open' : 'close'} filters</button>
          </div>
          <div
            className={`${
              on && 'hidden'
            } flex flex-wrap overflow-hidden sm:-mx-1 md:-mx-1`}
          >
            <div className="w-full overflow-hidden sm:my-1 sm:px-1 sm:w-full md:my-1 md:px-1 md:w-full lg:w-1/3 xl:w-1/3">
              <h3 className="font-bold">Topics</h3>
              <RefinementList limit={6} attribute="_tags" />
            </div>
            <div className="w-full overflow-hidden sm:my-1 sm:px-1 sm:w-full md:my-1 md:px-1 md:w-full lg:w-1/3 xl:w-1/3">
              <h3 className="font-bold">Instructors</h3>
              <RefinementList limit={6} attribute="instructor_name" />
            </div>
            <div className="w-full overflow-hidden sm:my-1 sm:px-1 sm:w-full md:my-1 md:px-1 md:w-full lg:w-1/3 xl:w-1/3">
              <h3 className="font-bold">Content Type</h3>
              <RefinementList attribute="type" />
            </div>
          </div>

          {onlyTheseInstructorsSelected(['Kent C. Dodds'], searchState) &&
            noTagsSelected(searchState) && <div>Learn from Kent</div>}

          {onlyTheseInstructorsSelected(['Kent C. Dodds'], searchState) &&
            onlyTheseTagsSelected(['react'], searchState) && (
              <div>Learn React from Kent</div>
            )}

          {noInstructorsSelected(searchState) &&
            onlyTheseTagsSelected(['react'], searchState) && (
              <SearchReact></SearchReact>
            )}

          <header>
            <SearchBox />
          </header>

          <div className="results pt-16">
            <Hits />
          </div>
        </main>
        <footer>
          <Pagination />
        </footer>
        {children}
      </InstantSearch>
    </>
  )
}

export default Search
