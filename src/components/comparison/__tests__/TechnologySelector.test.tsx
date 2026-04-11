import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TechnologySelector } from '../TechnologySelector';

const technologies = [
  { name: 'React', slug: 'react' },
  { name: 'Vue.js', slug: 'vuejs' },
  { name: 'Svelte', slug: 'svelte' },
  { name: 'Next.js', slug: 'nextjs' },
];

describe('TechnologySelector', () => {
  it('renders two select elements', () => {
    render(
      <TechnologySelector
        technologies={technologies}
        selectedSlugA=""
        selectedSlugB=""
        onChangeA={vi.fn()}
        onChangeB={vi.fn()}
        validationError={null}
      />
    );
    const selects = screen.getAllByRole('combobox');
    expect(selects).toHaveLength(2);
  });

  it('renders an option for each technology in both selects', () => {
    render(
      <TechnologySelector
        technologies={technologies}
        selectedSlugA=""
        selectedSlugB=""
        onChangeA={vi.fn()}
        onChangeB={vi.fn()}
        validationError={null}
      />
    );
    const selects = screen.getAllByRole('combobox') as HTMLSelectElement[];
    // Each select has a placeholder + 4 technology options
    for (const select of selects) {
      const techOptions = Array.from(select.options).filter((o) => o.value !== '');
      expect(techOptions).toHaveLength(4);
    }
  });

  it('calls onChangeA with the selected slug when the first select changes', async () => {
    const onChangeA = vi.fn();
    const user = userEvent.setup();

    render(
      <TechnologySelector
        technologies={technologies}
        selectedSlugA=""
        selectedSlugB=""
        onChangeA={onChangeA}
        onChangeB={vi.fn()}
        validationError={null}
      />
    );

    const [selectA] = screen.getAllByRole('combobox');
    await user.selectOptions(selectA, 'react');
    expect(onChangeA).toHaveBeenCalledWith('react');
  });

  it('calls onChangeB with the selected slug when the second select changes', async () => {
    const onChangeB = vi.fn();
    const user = userEvent.setup();

    render(
      <TechnologySelector
        technologies={technologies}
        selectedSlugA=""
        selectedSlugB=""
        onChangeA={vi.fn()}
        onChangeB={onChangeB}
        validationError={null}
      />
    );

    const [, selectB] = screen.getAllByRole('combobox');
    await user.selectOptions(selectB, 'svelte');
    expect(onChangeB).toHaveBeenCalledWith('svelte');
  });

  it('displays the validation error when validationError prop is non-null', () => {
    render(
      <TechnologySelector
        technologies={technologies}
        selectedSlugA="react"
        selectedSlugB="react"
        onChangeA={vi.fn()}
        onChangeB={vi.fn()}
        validationError="Please select two different technologies"
      />
    );
    expect(screen.getByText('Please select two different technologies')).toBeInTheDocument();
  });

  it('does not display an error when validationError is null', () => {
    render(
      <TechnologySelector
        technologies={technologies}
        selectedSlugA="react"
        selectedSlugB="svelte"
        onChangeA={vi.fn()}
        onChangeB={vi.fn()}
        validationError={null}
      />
    );
    expect(screen.queryByText('Please select two different technologies')).not.toBeInTheDocument();
  });

  it('reflects selectedSlugA as the controlled value of the first select', () => {
    render(
      <TechnologySelector
        technologies={technologies}
        selectedSlugA="react"
        selectedSlugB=""
        onChangeA={vi.fn()}
        onChangeB={vi.fn()}
        validationError={null}
      />
    );
    const [selectA] = screen.getAllByRole('combobox') as HTMLSelectElement[];
    expect(selectA.value).toBe('react');
  });

  it('reflects selectedSlugB as the controlled value of the second select', () => {
    render(
      <TechnologySelector
        technologies={technologies}
        selectedSlugA=""
        selectedSlugB="svelte"
        onChangeA={vi.fn()}
        onChangeB={vi.fn()}
        validationError={null}
      />
    );
    const [, selectB] = screen.getAllByRole('combobox') as HTMLSelectElement[];
    expect(selectB.value).toBe('svelte');
  });
});
