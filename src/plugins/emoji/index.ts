import { Config } from '../../Config';
import { IJodit, IControlType, IToolbarButton } from '../../types';

import './emoji.less';
import * as emojiCollection from './emoji.json';

interface IEmojiCategories {
  [key: string]: string;
}

interface IEmoji {
	id:       string;
	symbol:   string;
	group:    string;
	keywords: string[];
}

const categories: IEmojiCategories = {
	people:     'Smileys & People',
	nature:     'Animals & Nature',
	food:       'Food & Drink',
	travel:     'Travel & Places',
	activities: 'Activities',
	objects:    'Objects',
	symbols:    'Symbols',
	flags:      'Flags',
}

let $popupHtml: HTMLDivElement;


Config.prototype.controls.emoji = {
	tooltip: 'Insert Emoji',
	iconURL: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAwIDEwMDAiIGNsYXNzPSJqb2RpdF9pY29uIGpvZGl0X2ljb25fZW1vamkiPjxwYXRoIGQ9Ik01MDAsOTkwQzIyOS44LDk5MCwxMCw3NzAuMiwxMCw1MDBDMTAsMjI5LjgsMjI5LjgsMTAsNTAwLDEwYzI3MC4yLDAsNDkwLDIxOS44LDQ5MCw0OTBTNzcwLjIsOTkwLDUwMCw5OTB6IE01MDAsODBDMjY4LjQsODAsODAsMjY4LjQsODAsNTAwczE4OC40LDQyMCw0MjAsNDIwYzIzMS42LDAsNDIwLTE4OC40LDQyMC00MjBTNzMxLjYsODAsNTAwLDgweiBNNTAxLjIsNzg1LjhjLTk3LjUsMC0xODgtNDQuMS0yNDguMi0xMjFjLTExLjktMTUuMi05LjItMzcuMiw2LTQ5LjFjMTUuMi0xMS45LDM3LjItOS4zLDQ5LjEsNmM0Ni44LDU5LjgsMTE3LjIsOTQuMSwxOTMuMSw5NC4xYzc2LjcsMCwxNDcuNS0zNC45LDE5NC4zLTk1LjhjMTEuOC0xNS4zLDMzLjctMTguMiw0OS4xLTYuNGMxNS4zLDExLjgsMTguMiwzMy44LDYuNCw0OS4xQzY5MC44LDc0MSw1OTkuNyw3ODUuOCw1MDEuMiw3ODUuOEw1MDEuMiw3ODUuOHogTTM0My43LDUwMy41Yy0yOSwwLTUyLjUtMjMuNS01Mi41LTUyLjV2LTcwYzAtMjksMjMuNS01Mi41LDUyLjUtNTIuNXM1Mi41LDIzLjUsNTIuNSw1Mi41djcwQzM5Ni4yLDQ4MCwzNzIuNiw1MDMuNSwzNDMuNyw1MDMuNXogTTY1OC43LDUwMy41Yy0yOSwwLTUyLjUtMjMuNS01Mi41LTUyLjV2LTcwYzAtMjksMjMuNS01Mi41LDUyLjUtNTIuNWMyOSwwLDUyLjUsMjMuNSw1Mi41LDUyLjV2NzBDNzExLjIsNDgwLDY4Ny42LDUwMy41LDY1OC43LDUwMy41eiI+PC9wYXRoPjwvc3ZnPgo=',

	popup: (editor: IJodit, current: (Node | false), control:  IControlType, close: () => void, button: IToolbarButton) => {
		if ($popupHtml) {
			return $popupHtml;
		}

		let groups: any = {};
		let previousGroupName: string;
		let $categoryTitle: HTMLElement;
		let $category: HTMLElement;

		const $navigation = editor.create.div('oho-jodit_emoji_nav jodit_tabs_buttons');
		const $collection = editor.create.div('oho-jodit_emoji_collection');

		emojiCollection.forEach((emoji: IEmoji, currentIndex: number) => {
			if (previousGroupName != emoji.group) {
				const groupName = categories[emoji.group];

				$categoryTitle = editor.create.fromHTML(`<div class="oho-jodit_emoji_caption" id="emoji-${emoji.group}">${groupName}</div>`);
				$category = editor.create.fromHTML(`<ul class="oho-jodit_emoji_group">`);

				$collection.appendChild($categoryTitle);
				$collection.appendChild($category);
			}

			$category.appendChild(editor.create.fromHTML(`<li class="oho-jodit_emoji_item" title="${emoji.id}" data-id="${emoji.id}">${emoji.symbol}</li>`));

			previousGroupName = emoji.group;
		});

		$navigation.innerHTML = `
			<a href="javascript:void(0);" data-category="people"     title="${editor.i18n(categories.people)}"     class="active">&nbsp;</a>
			<a href="javascript:void(0);" data-category="nature"     title="${editor.i18n(categories.nature)}"     >&nbsp;</a>
			<a href="javascript:void(0);" data-category="food"       title="${editor.i18n(categories.food)}"       >&nbsp;</a>
			<a href="javascript:void(0);" data-category="travel"     title="${editor.i18n(categories.travel)}"     >&nbsp;</a>
			<a href="javascript:void(0);" data-category="activities" title="${editor.i18n(categories.activities)}" >&nbsp;</a>
			<a href="javascript:void(0);" data-category="objects"    title="${editor.i18n(categories.objects)}"    >&nbsp;</a>
			<a href="javascript:void(0);" data-category="symbols"    title="${editor.i18n(categories.symbols)}"    >&nbsp;</a>
			<a href="javascript:void(0);" data-category="flags"      title="${editor.i18n(categories.flags)}"      >&nbsp;</a>
		`;

		setTimeout(() => {
			const captions = $collection.querySelectorAll(".oho-jodit_emoji_caption");

			Array.prototype.forEach.call(captions, function(e) {
			  groups[e.id] = e.offsetTop;
			});
		}, 100);

		editor.events.on($navigation, 'mousedown touchend', (e: MouseEvent) => {
			e.stopPropagation();

			let target: HTMLElement = e.target as HTMLElement;
			if (target.tagName.toUpperCase() !== 'A') {
				return;
			}

			let active: HTMLElement | null = $navigation.querySelector('a.active');
			if (active) {
				active.classList.remove('active');
			}

			let categoryCaption: HTMLElement | null = $collection.querySelector('#emoji-' + target.getAttribute('data-category') as string);
			if (categoryCaption) {
				$collection.scrollTop = categoryCaption.offsetTop - $collection.offsetTop;
			}

			target.classList.add('active');

			e.preventDefault();
		});

		editor.events.on($collection, 'scroll', (e: MouseEvent) => {
      let scrollPosition = $collection.scrollTop + $collection.offsetTop + 2;

      for (let i in groups) {
        if (groups[i] <= scrollPosition) {
        	let active: HTMLElement | null = $navigation.querySelector('a.active');
        	if (active) {
        		active.classList.remove('active');
        	}

          let current = $navigation.querySelector('[data-category=' + i.replace('emoji-', '') + ']');
          if (current) {
          	current.classList.add('active');
          }
        }
      }
    });

 		editor.events.on($collection, 'mousedown', (e: MouseEvent) => {
 			e.stopPropagation();

 			let target: HTMLElement = e.target as HTMLElement;
 			if (target.tagName.toUpperCase() !== 'LI') {
 				return;
 			}

 			editor.selection.insertHTML(`<span>${target.innerHTML}</span>`);

 			// close();
 	    e.preventDefault();
 		});

		$popupHtml = editor.create.div('oho-jodit_emoji_popup jodit_tabs');
		$popupHtml.appendChild($navigation);
		$popupHtml.appendChild($collection);

		return $popupHtml;
	}
} as IControlType;


/**
 * Emoji plugin - insert unicode emoji
 *
 * @param {Jodit} editor
 */
export function emoji(editor: IJodit) {}
