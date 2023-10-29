import chalk from 'chalk';
import { render } from 'ink-testing-library/build';
import React from 'react';
import { describe, expect, it } from 'vitest';
import App from '../source/app';

describe('CLI', () => {
	it('greet unknown user', () => {
		const { lastFrame } = render(<App name={undefined} />);
		expect(lastFrame()).toBe(`Hello, ${chalk.green('Stranger')}`);
	});

	it('greet user with a name', () => {
		const { lastFrame } = render(<App name="Jane" />);
		expect(lastFrame()).toBe(`Hello, ${chalk.green('Jane')}`);
	});
});
