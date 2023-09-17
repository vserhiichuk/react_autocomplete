import React, { useState, useMemo } from 'react';
import debounce from 'lodash.debounce';
import cn from 'classnames';

import { Person } from '../../types/Person';
import { peopleFromServer } from '../../data/people';

interface Props {
  onSelected?: (person: Person) => void,
  delay: number
}

export const Autocomplete: React.FC<Props> = React.memo(
  ({
    onSelected = () => { },
    delay,
  }) => {
    const [showPeople, setShowPeople] = useState(false);
    const [query, setQuery] = useState('');
    const [appliedQuery, setAppliedQuery] = useState('');

    const applyQuery = debounce(setAppliedQuery, delay);

    const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      applyQuery(event.target.value);
    };

    const handleSelectedPerson = (person: Person) => {
      onSelected(person);
      setQuery(person.name);
      applyQuery(person.name);
    };

    const filteredPeople = useMemo(() => {
      return peopleFromServer
        .filter(person => person.name.includes(appliedQuery));
    }, [peopleFromServer, appliedQuery]);

    return (
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
            onClick={() => setShowPeople(true)}
            onBlur={() => setShowPeople(false)}
          />
        </div>

        {showPeople && (
          <div className="dropdown-menu" role="menu">
            {filteredPeople.length
              ? (
                <div className="dropdown-content">
                  {filteredPeople.map(person => (
                    <a
                      key={person.slug}
                      className={cn('dropdown-item', {
                        'has-text-link': person.sex === 'm',
                        'has-text-danger': person.sex === 'f',
                      })}
                      href={`/${person.slug}`}
                      onMouseDown={() => handleSelectedPerson(person)}
                    >
                      {person.name}
                    </a>
                  ))}
                </div>
              )
              : (
                <p>No matching suggestions</p>
              )}
          </div>
        )}
      </div>
    );
  },
);