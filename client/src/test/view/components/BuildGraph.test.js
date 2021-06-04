import * as LocalLoaderController from '../../../controller/LocalLoaderController';
import * as Store from '../../../store/Store';
import { afterAll, beforeAll, describe, expect, jest, test } from '@jest/globals';
import BuildGraph, { needsAlgorithm, needsDistance, selectedInsert } from '../../../view/components/BuildGraph';
import { act } from 'react-dom/test-utils';
import Insert from '../../../view/components/startUpOptions/chooseDataset/Insert';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import React from 'react';

describe("BuildGraph component tests", () => {

	let wrapper;
	const parseSpy = jest.fn();
	const setState = jest.fn();
	const defineStore = jest.fn();

	beforeAll(() => {
		jest.spyOn(LocalLoaderController, "useLocalLoaderController").mockImplementation(() => {
			return {
				parse: parseSpy
			}
		})
		jest.spyOn(Store, "useStore").mockImplementation(() => {
			return {
				getNumericFeatures: jest.fn(),
				getStringFeatures: jest.fn()
			}
		})
		Object.defineProperty(React, 'useRef', {
            value: () => {
				return { current: ''};
			}
        })
		jest.spyOn(React, "useState")
			.mockImplementationOnce(() => 'scptMat')
			.mockImplementationOnce(() => [{ name: 'test'}, setState])
			.mockImplementationOnce(() => [['testcol1', 'testcol2'], setState])
			.mockImplementationOnce(() => ['species', setState])
			.mockImplementationOnce(() => [false, setState])
			.mockImplementationOnce(val => [val, setState])
			.mockImplementationOnce(val => [val, setState])
			.mockImplementationOnce(val => [val, setState])
			.mockImplementationOnce(val => [val, setState])
			.mockImplementationOnce(val => [val, setState])
			.mockImplementationOnce(() => ['FASTMAP', setState])
			.mockImplementationOnce(() => [true, setState])
			.mockImplementationOnce(() => [['testcol1', 'testcol2'], setState])
			.mockImplementationOnce(() => ['', setState])
			.mockImplementationOnce(val => [val, setState])
			.mockImplementationOnce(val => [val, setState])
			.mockImplementationOnce(val => [val, setState])
		wrapper = mount(<MemoryRouter><BuildGraph defineStore={defineStore}/></MemoryRouter>);	
	})

	beforeEach(() => {
		jest.clearAllMocks();
	})

	afterAll(() => {
		jest.restoreAllMocks();
		wrapper.unmount();
	})

	test("Testing render", () => {
		expect(wrapper).not.toBeNull();
	})

	test('needsAlgorithm must return true', () => {
		expect(needsAlgorithm('scptMat')).toBe(true);
		expect(needsAlgorithm('malp')).toBe(true);
	})

	test('needsDistance must return true', () => {
		expect(needsDistance('htmp')).toBe(true);
		expect(needsDistance('frcfld')).toBe(true);
		expect(needsDistance('FASTMAP')).toBe(true);
		expect(needsDistance('ISOMAP')).toBe(true);
		expect(needsDistance('T-SNE')).toBe(true);
		expect(needsDistance('LLE')).toBe(true);
	})

	test('selectedInsert must return the correct value', () => {
		expect(selectedInsert({name: ''})).toBe(true);
		expect(selectedInsert({name: undefined})).toBe(false);
	})

	test('onChangeInsert must call setState and parse', () => {
		act(() => {
			const onChangeInsert = wrapper.find(Insert).prop('onChange');
			const file = new File([''], 'testFile.json', { type: "text/json" });
			expect(parseSpy).not.toBeCalled();
			expect(setState).not.toBeCalled();
			onChangeInsert({ target: { files: [file] } });
			expect(parseSpy).toBeCalled();
			expect(setState).toBeCalled();
		})
	})

	test('onChangeGraph must call setState', () => {
	//	console.log(wrapper.debug())
	})
});