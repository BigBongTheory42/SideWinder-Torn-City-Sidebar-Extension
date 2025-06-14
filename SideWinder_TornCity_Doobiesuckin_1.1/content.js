(function() {
    'use strict';
    const STORAGE_TYPE = typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local ? 'chrome' : 'local';
    const CONSTANTS = {
        VERSION: '1.1',
        SIDEBAR_WIDTH: 425,
        MIN_GROUP_WIDTH: 180,
        MIN_GROUP_HEIGHT: 100,
        TRADEMARK: '𝕊𝕚𝕕𝕖𝕎𝕚𝕟𝕕𝕖𝕣🔰',
        TAGLINES: [
            "Made with love by Doobiesuckin [3255641]",
            "Sometimes, It Doobiesuckin",
            "Hope your Enjoying the SideWinder Script!",
            "Does anyone actually read these?",
            "Tokyo Syndicate is the Best Faction",
            "Detecting Multiple Leviathan Class lifeforms in the Region",
            "Wanna Sign My Petition?",
            "Gordon! Get away from the Beam!",
            "Wait...If I smack Dwayne Johnsons butt, Did I hit rock bottom?",
            "I wrote this Splash Text on 12-29-24",
            "A Friend with Weed is a Friend Indeed",
            "So, You like Jazz?",
            "Fixing Torn's UI One Script at a Time!",
            "Caution: May contain nuts.",
            "All bugs are intentional. Trust the process",
            "This Sidebar is Fully optimized for staring contests.",
            "You Should give me a Donation, You know you want to",
            "Check out Community Crafters on Discord Forums!",
            "30% Less Likely to scam you over Leslie!",
            "Did you know? The average cloud weighs about 1 million pounds!",
            "Did you know? Some snails can sleep for three years straight!",
            "Did you know? Cheese is the most stolen food in the world!",
            "Be sure to Like and Review our Forum post!",
            "-Insert Cool Sidebar Music-",
            "I'm alive! I'm Ali...ERR0r..Sidewinder Re-Initialized",
            "A Script Chedburn Himself is Jealous of!",
            "Woah, Was that Legal?",
            "Still trying to find the funny",
            "Did you Take a Xanax Today?",
            "Remember Bazaars? Those were cool huh",
            "Keep Grinding those Crimes!",
            "Why not sign yourself up for a race?",
            "Your so close to that Gambling win, I can Feel it!",
            "Voice Mode Enabled, You can now Start Voicing Commands",
            "Ooh Baby, I'm debugging myself right now.",
            "Never Gonna Give you up, Never gonna let you down",
            "1f c0d3 === l1f3) { r3sp4wn();",
            "I don't even know how to code! -Doobie",
            "There's no place like 127.0.0.1...",
            "Happiness is just a hospital trip away.",
            "One man's trash is another's bazaar stock.",
            "Sleep is overrated when there's money to be mugged.",
            "Peace is just the downtime between wars.",
            "You call it scamming. We call it creative capitalism.",
            "You can Drag and Resize Groups in Edit Mode",
            "You can Delete Links, Targets, Groups and more In Delete Mode",
            "Create New Groups by Clicking the Green + button!",
            "Use Unicode when Selectiong Emojis for Links",
            "Find me on Dread! JK",
            "Struggle is the enemy, Weed is my remedy",
            "Dirty Hands, Clean Money",
            "Loading Additional Skill Modules",
            "Fire Script. No cap, On God - You Probably",
            "Idle Hands Leave you evil thoughts",
            "100% American Made",
            "If Diddy Did Diddle Dudes, How many Dudes Did Diddy Diddle?",
            "Add a new Link! I can Take it!",
            "Why'd you just do that?",
            "You've been Blessed! No OD's For 0.25 seconds! Better Hurry!",
            "Is this thing on",
            "01010101 01001110 01100101 01110010 01100100",
            "Shout out my dog, Torque the Husky",
            "Find Torn Tutorials on Youtube, Forums, and more!",
            "That didnt go to plan...",
            "Grass tastes bad",
            "Thats what she said",
            "28:06:42:12",
            "I have an inferiority complex, but it's not a very good one",
            "You've gotta hand it to blind prostitutes.",
            "I havent slept for 4 days! That would be too long.",
            "I, for one, like Roman numerals.",
            "Remember, There is no i in denial",
            "This Script is Open Source on Github!",
        ],
        STATE_KEYS: {
            SIDEBAR_POSITION: 'sidebarPosition',
            GROUPS: 'sidebarGroups',
            NOTEPADS: 'sidebarNotepads',
            ATTACK_LISTS: 'attackLists',
            TODO_LISTS: 'todoLists',
            LOAN_TRACKER: 'loanTracker',
            AUCTION_TRACKER: 'auctionTracker',
            COUNTDOWN_GROUPS: 'countdownGroups',
            MANUAL_COUNTDOWN_GROUPS: 'manualCountdownGroups',
            LIGHT_MODE: 'lightMode',
            MINIMIZE_STATES: 'minimizeStates',
            SIDEBAR_STATE: 'sidebarState',
            CURRENT_PAGE: 'currentPage',
            PAGE_DATA: 'pageData'
        },
        THEMES: {
            LIGHT: {
                BG: '#ffffff',
                TEXT: '#000000',
                subTEXT: '#333333',
                BORDER: '#cccccc',
                HEADER: '#e0e0e0',
                SECONDARY_BG: '#f0f0f0',
                BUTTON_BG: '#c1bfbf',
                SUCCESS: '#336633',
                DANGER: '#cc3333',
                BottomButtonBG: '#666',
                adddCurrentBG: '#42697a',
            },
            DARK: {
                BG: '#1a1a1a',
                TEXT: '#ffffff',
                subTEXT: '#cccccc',
                BORDER: '#444444',
                HEADER: '#2c2c2c',
                SECONDARY_BG: '#333333',
                BUTTON_BG: '#444444',
                SUCCESS: '#55aa55',
                DANGER: '#ff5555',
                BottomButtonBG: '#444'
            }
        }
    };
    const state = {
        isSidebarRight: false,
        groups: [],
        notepads: [],
        attackLists: [],
        todoLists: [],
        loanTracker: {
            entries: []
        },
        auctionTracker: {
            auctions: []
        },
        countdownGroups: [],
        manualCountdownGroups: [],
        isEditMode: false,
        isDeleteMode: false,
        isDragging: false,
        dragTarget: null,
        isLightMode: false,
        isGlobalResizing: false,
        isAutoWidth: localStorage.getItem('sidebarAutoWidth') !== '0',
        debugMenuOpen: false,
        currentPage: 0,
        pageData: [],
        clockVisible: false,
        calculatorVisible: false
    };
    const utils = {
        getSidebarWidth: () => {
            if (window.innerWidth < 768) return window.innerWidth;
            if (state.isAutoWidth) {
                return new Promise(resolve => {
                    requestAnimationFrame(() => {
                        const allElements = document.querySelectorAll('.draggable');
                        const elements = Array.from(allElements);
                        const elementMetrics = elements.map(el => {
                            const width = el.offsetWidth || parseInt(el.style.width) || CONSTANTS.MIN_GROUP_WIDTH;
                            const left = parseInt(el.style.left) || 0;
                            return {
                                width,
                                left,
                                right: left + width
                            };
                        });
                        if (!state.isEditMode) {
                            const maxRight = Math.max(...elementMetrics.map(m => m.right));
                            const compactWidth = Math.max(CONSTANTS.SIDEBAR_WIDTH, maxRight + 5);
                            const finalWidth = Math.min(compactWidth, Math.floor(window.innerWidth * 0.6));
                            localStorage.setItem('sidebarWidth', finalWidth);
                            resolve(finalWidth);
                            return;
                        }
                        elementMetrics.sort((a, b) => b.width - a.width);
                        let calculatedWidth;
                        if (elementMetrics.length >= 2) {
                            calculatedWidth = elementMetrics[0].width + elementMetrics[1].width + 40;
                        } else if (elementMetrics.length === 1) {
                            calculatedWidth = elementMetrics[0].width + 20;
                        } else {
                            calculatedWidth = CONSTANTS.SIDEBAR_WIDTH;
                        }
                        const minWidth = Math.max(CONSTANTS.SIDEBAR_WIDTH, calculatedWidth);
                        const maxWidth = Math.floor(window.innerWidth * 0.6);
                        const finalWidth = Math.min(minWidth, maxWidth);
                        localStorage.setItem('sidebarWidth', finalWidth);
                        resolve(finalWidth);
                    });
                });
            }
            return parseInt(localStorage.getItem('sidebarWidth')) || CONSTANTS.SIDEBAR_WIDTH;
        },
        getContrastingTextColor: (backgroundColor) => {
            let r, g, b;
            if (backgroundColor.startsWith('#')) {
                const hex = backgroundColor.replace('#', '');
                r = parseInt(hex.substr(0, 2), 16);
                g = parseInt(hex.substr(2, 2), 16);
                b = parseInt(hex.substr(4, 2), 16);
            } else if (backgroundColor.startsWith('rgb')) {
                const rgb = backgroundColor.match(/\d+/g);
                r = parseInt(rgb[0]);
                g = parseInt(rgb[1]);
                b = parseInt(rgb[2]);
            } else {
                return '#000000';
            }
            const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            return luminance > 0.55 ? '#000000' : '#FFFFFF';
        },
        applySidebarWidth: async () => {
            const sidebar = document.getElementById('enhanced-sidebar');
            if (!sidebar) return;
            const width = await utils.getSidebarWidth();
            sidebar.style.width = `${width}px`;
        },
        safeStorage: async (operation, data = null) => {
            try {
                if (STORAGE_TYPE === 'chrome') {
                    if (operation === 'get') {
                        return new Promise((resolve) => {
                            chrome.storage.local.get(data, result => {
                                resolve(chrome.runtime.lastError ? null : result);
                            });
                        });
                    } else if (operation === 'set') {
                        return new Promise((resolve) => {
                            chrome.storage.local.set(data, () => {
                                resolve(chrome.runtime.lastError ? false : true);
                            });
                        });
                    } else if (operation === 'remove') {
                        return new Promise((resolve) => {
                            chrome.storage.local.remove(data, () => {
                                resolve(chrome.runtime.lastError ? false : true);
                            });
                        });
                    }
                } else {
                    if (operation === 'get') {
                        const result = {};
                        data.forEach(key => {
                            result[key] = localStorage.getItem(key);
                        });
                        return result;
                    } else if (operation === 'set') {
                        Object.entries(data).forEach(([key, value]) => {
                            localStorage.setItem(key, JSON.stringify(value));
                        });
                        return true;
                    } else if (operation === 'remove') {
                        data.forEach(key => {
                            localStorage.removeItem(key);
                        });
                        return true;
                    }
                }
            } catch (err) {
                console.error('Storage operation failed:', err);
                return null;
            }
        },
        saveState: (key, value) => {
            const valueToStore = typeof value === 'string' ? value : JSON.stringify(value);
            if (STORAGE_TYPE === 'chrome') {
                chrome.storage.local.set({
                    [key]: valueToStore
                });
            }
            localStorage.setItem(key, valueToStore);
            localStorage.setItem(`${key}_updatedAt`, Date.now());
            const currentValue = localStorage.getItem(key);
            if (currentValue) localStorage.setItem(`${key}_backup`, currentValue);
            return true;
        },
        loadState: (key, defaultValue) => {
            try {
                const value = localStorage.getItem(key);
                return (!value || value === "null") ? defaultValue : JSON.parse(value);
            } catch (e) {
                console.error(`Error loading state for ${key}:`, e);
                return defaultValue;
            }
        },
        getTheme: () => state.isLightMode ? CONSTANTS.THEMES.LIGHT : CONSTANTS.THEMES.DARK,
        formatDate: (dateStr) => {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        },
        showToast: (message, type = 'info') => {
            const existingToast = document.getElementById('sidebar-toast');
            if (existingToast) existingToast.remove();
            const theme = utils.getTheme();
            const sidebar = document.getElementById('enhanced-sidebar');
            const currentSidebarWidth = sidebar ? sidebar.offsetWidth : CONSTANTS.SIDEBAR_WIDTH;
            const toast = document.createElement('div');
            toast.id = 'sidebar-toast';
            let backgroundColor, textColor, borderColor;
            switch (type) {
                case 'error':
                    backgroundColor = state.isLightMode ? '#ffeeee' : '#552222';
                    textColor = state.isLightMode ? '#cc3333' : '#ffcccc';
                    borderColor = state.isLightMode ? '#ffcccc' : '#993333';
                    break;
                case 'success':
                    backgroundColor = state.isLightMode ? '#eeffee' : '#225522';
                    textColor = state.isLightMode ? '#33cc33' : '#ccffcc';
                    borderColor = state.isLightMode ? '#ccffcc' : '#339933';
                    break;
                default:
                    backgroundColor = theme.SECONDARY_BG;
                    textColor = theme.TEXT;
                    borderColor = theme.BORDER;
            }
            toast.style.cssText = `position: fixed; bottom: 50px; left: ${currentSidebarWidth / 2 - 150}px; width: 300px; padding: 10px 15px; background-color: ${backgroundColor}; color: ${textColor}; border: 1px solid ${borderColor}; border-radius: 5px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); z-index: 992000; text-align: center; animation: toastFadeIn 0.3s ease;`;
            const style = document.createElement('style');
            style.textContent = `@keyframes toastFadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } } @keyframes toastFadeOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(20px); } }`;
            document.head.appendChild(style);
            toast.textContent = message;
            document.body.appendChild(toast);
            setTimeout(() => {
                toast.style.animation = 'toastFadeOut 0.3s ease forwards';
                setTimeout(() => {
                    if (toast.parentNode) toast.parentNode.removeChild(toast);
                }, 300);
            }, 3000);
        },
        validateState: () => {
            if (!Array.isArray(state.groups)) {
                console.error('Groups is not an array, resetting to default');
                state.groups = [];
            }
            if (!Array.isArray(state.notepads)) {
                console.error('Notepads is not an array, resetting to default');
                state.notepads = [];
            }
            if (!Array.isArray(state.attackLists)) {
                console.error('Attack lists is not an array, resetting to default');
                state.attackLists = [];
            }
            if (!Array.isArray(state.todoLists)) {
                console.error('Todo lists is not an array, resetting to default');
                state.todoLists = [];
            }
            if (!state.loanTracker || typeof state.loanTracker !== 'object') {
                console.error('Loan tracker is invalid, resetting to default');
                state.loanTracker = {
                    entries: []
                };
            } else if (!Array.isArray(state.loanTracker.entries)) {
                state.loanTracker.entries = [];
            }
            if (!state.auctionTracker || typeof state.auctionTracker !== 'object') {
                console.error('Auction tracker is invalid, resetting to default');
                state.auctionTracker = {
                    auctions: []
                };
            } else if (!Array.isArray(state.auctionTracker.auctions)) {
                state.auctionTracker.auctions = [];
            }
            if (!Array.isArray(state.countdownGroups)) {
                console.error('Countdown groups is not an array, resetting to default');
                state.countdownGroups = [];
            }
            if (!Array.isArray(state.manualCountdownGroups)) {
                console.error('Manual countdown groups is not an array, resetting to default');
                state.manualCountdownGroups = [];
            }
            let auctionsUpdated = false;
            state.auctionTracker.auctions.forEach(auction => {
                if (auction.timeLeft !== undefined && auction.endTime === undefined) {
                    auction.endTime = Date.now() + (auction.timeLeft * 60 * 1000);
                    auction.created = Date.now();
                    delete auction.timeLeft;
                    auctionsUpdated = true;
                }
            });
            if (auctionsUpdated) utils.saveState(`${CONSTANTS.STATE_KEYS.AUCTION_TRACKER}_${state.currentPage}`, state.auctionTracker);
            let loansUpdated = false;
            state.loanTracker.entries.forEach(entry => {
                if (!entry.payments) {
                    entry.payments = [];
                    entry.created = Date.now();
                    loansUpdated = true;
                }
            });
            if (loansUpdated) utils.saveState(`${CONSTANTS.STATE_KEYS.LOAN_TRACKER}_${state.currentPage}`, state.loanTracker);
            if (state.countdownGroups.length > 1) {
                for (let i = 1; i < state.countdownGroups.length; i++) {
                    if (state.countdownGroups[i].timers && Array.isArray(state.countdownGroups[i].timers)) {
                        if (!state.countdownGroups[0].timers) state.countdownGroups[0].timers = [];
                        state.countdownGroups[0].timers = state.countdownGroups[0].timers.concat(state.countdownGroups[i].timers);
                    }
                }
                state.countdownGroups = [state.countdownGroups[0]];
                utils.saveState(`${CONSTANTS.STATE_KEYS.COUNTDOWN_GROUPS}_${state.currentPage}`, state.countdownGroups);
            }
        },
        preserveSidebarAnimation: () => {
            const sidebar = document.getElementById('enhanced-sidebar');
            const toggleButton = document.getElementById('sidebar-toggle');
            if (sidebar && toggleButton) {
                const currentTransform = window.getComputedStyle(sidebar).transform;
                const isHidden = currentTransform.includes('-102') || currentTransform.includes('matrix');
                sidebar.style.transition = 'transform 0.3s ease-in-out';
                toggleButton.style.transition = 'transform 0.3s ease-in-out, background-color 0.2s ease';
                utils.saveState(CONSTANTS.STATE_KEYS.SIDEBAR_STATE, {
                    isHidden
                });
            }
        },
        getLighterColor: (color) => {
            if (color.startsWith('#')) {
                let hex = color.slice(1);
                if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
                const r = Math.min(255, parseInt(hex.slice(0, 2), 16) + 20);
                const g = Math.min(255, parseInt(hex.slice(2, 4), 16) + 20);
                const b = Math.min(255, parseInt(hex.slice(4, 6), 16) + 20);
                return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
            }
            return color;
        },
        formatTimeLeft: (endTime) => {
            const remainingMs = endTime - Date.now();
            if (remainingMs <= 0) return "Ended";
            const totalHours = Math.floor(remainingMs / (60 * 60 * 1000));
            const days = Math.floor(totalHours / 24);
            const hours = totalHours % 24;
            const minutes = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));
            const seconds = Math.floor((remainingMs % (60 * 1000)) / 1000);
            let formattedTime = '';
            if (days > 0) formattedTime += `${days}d `;
            if (hours > 0 || days > 0) formattedTime += `${hours}h `;
            if (minutes > 0 || hours > 0 || days > 0) formattedTime += `${minutes}m `;
            formattedTime += `${seconds}s`;
            if (days > 99999) return `${days}d ${hours}h`;
            return formattedTime.trim();
        },
        isEnding: (endTime) => (endTime - Date.now()) <= 15 * 60 * 1000,
        getAuctionColor: (endTime, theme) => {
            const timeLeft = endTime - Date.now();
            if (timeLeft <= 0) return theme.DANGER;
            if (timeLeft <= 5 * 60 * 1000) return theme.DANGER;
            if (timeLeft <= 15 * 60 * 1000) return '#FFA500';
            return theme.SUCCESS;
        },
        isOverdue: (entry) => {
            if (!entry.dueDate) return false;
            const now = new Date();
            const due = new Date(entry.dueDate);
            return now > due;
        },
        getDueDateColor: (entry, theme) => {
            if (!entry.dueDate) return theme.BORDER;
            if (utils.isOverdue(entry)) return theme.DANGER;
            const now = new Date();
            const due = new Date(entry.dueDate);
            const daysUntilDue = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
            if (daysUntilDue <= 3) return '#FFA500';
            return theme.SUCCESS;
        },
        getCurrentPageUserId: () => {
            const currentUrl = window.location.href;
            const urlParams = new URLSearchParams(window.location.search);
            if (currentUrl.includes('loader.php?sid=attack')) {
                const attackTargetId = urlParams.get('user2ID');
                if (attackTargetId && !isNaN(parseInt(attackTargetId))) {
                    return parseInt(attackTargetId);
                }
            }
            if (currentUrl.includes('profiles.php') || currentUrl.includes('profile.php')) {
                const xid = urlParams.get('XID');
                const id = urlParams.get('ID');
                const validId = xid || id;
                if (validId && !isNaN(parseInt(validId))) {
                    return parseInt(validId);
                }
            }
            const idSelectors = [
                '[class*="userID"]',
                '[class*="userId"]',
                '[id*="userID"]',
                '[id*="userId"]',
                '.basic-information .user-info-value',
                '.profile-container [class*="id"]',
                '.profile-wrapper [class*="id"]',
                '[data-user]',
                '[data-uid]',
                '[data-player-id]'
            ];
            for (const selector of idSelectors) {
                const element = document.querySelector(selector);
                if (element) {
                    const content = element.textContent || element.value || element.getAttribute('data-user') ||
                        element.getAttribute('data-uid') || element.getAttribute('data-player-id');
                    if (content) {
                        const match = content.match(/\d+/);
                        if (match && !isNaN(parseInt(match[0]))) {
                            return parseInt(match[0]);
                        }
                    }
                }
            }
            if (currentUrl.includes('loader.php?sid=attack')) {
                const attackWrappers = document.querySelectorAll('.attack-user');
                for (const wrapper of attackWrappers) {
                    const idElement = wrapper.querySelector('[class*="userID"], [class*="userId"]');
                    if (idElement && idElement.textContent) {
                        const match = idElement.textContent.match(/\d+/);
                        if (match && !isNaN(parseInt(match[0]))) {
                            return parseInt(match[0]);
                        }
                    }
                }
            }
            return null;
        },
        getSecondaryColor: (primaryColor) => {
            if (!primaryColor) return utils.getTheme().SECONDARY_BG;
            const hex = primaryColor.replace('#', '');
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            return (brightness > 128) ? utils.adjustColor(primaryColor, -30) : utils.adjustColor(primaryColor, 30);
        },
        adjustColor: (color, amount) => {
            color = color.replace('#', '');
            let r = Math.max(Math.min(parseInt(color.substring(0, 2), 16) + amount, 255), 0);
            let g = Math.max(Math.min(parseInt(color.substring(2, 4), 16) + amount, 255), 0);
            let b = Math.max(Math.min(parseInt(color.substring(4, 6), 16) + amount, 255), 0);
            const rr = ((r.toString(16).length === 1) ? "0" + r.toString(16) : r.toString(16));
            const gg = ((g.toString(16).length === 1) ? "0" + g.toString(16) : g.toString(16));
            const bb = ((b.toString(16).length === 1) ? "0" + b.toString(16) : b.toString(16));
            return "#" + rr + gg + bb;
        },
        findOptimalPosition: () => {
            const sidebar = document.getElementById('enhanced-sidebar');
            const container = document.getElementById('group-container');
            if (!sidebar || !container) return {
                x: 0,
                y: 0
            };
            const sidebarRect = sidebar.getBoundingClientRect();
            const existingElements = Array.from(document.querySelectorAll('.draggable'));
            const gridSize = 20;
            const padding = 10;
            const elementWidth = CONSTANTS.MIN_GROUP_WIDTH;
            const elementHeight = CONSTANTS.MIN_GROUP_HEIGHT;
            let positions = [];
            for (let y = padding; y <= sidebarRect.height - elementHeight - padding; y += gridSize) {
                for (let x = padding; x <= sidebarRect.width - elementWidth - padding; x += gridSize) {
                    positions.push({
                        x,
                        y,
                        overlaps: 0
                    });
                }
            }
            positions.forEach(pos => {
                existingElements.forEach(element => {
                    const rect = element.getBoundingClientRect();
                    const elementPos = {
                        x: parseInt(element.style.left) || 0,
                        y: parseInt(element.style.top) || 0,
                        width: rect.width,
                        height: rect.height
                    };
                    if (pos.x < elementPos.x + elementPos.width + padding &&
                        pos.x + elementWidth + padding > elementPos.x &&
                        pos.y < elementPos.y + elementPos.height + padding &&
                        pos.y + elementHeight + padding > elementPos.y) {
                        pos.overlaps++;
                    }
                });
            });
            positions.sort((a, b) => {
                if (a.overlaps !== b.overlaps) return a.overlaps - b.overlaps;
                return (a.x + a.y) - (b.x + b.y);
            });
            return positions.length > 0 ? positions[0] : {
                x: 0,
                y: 0
            };
        }
    };
    const dom = {
        createResizer: (element, isLightMode, isEditMode, onResize) => {
            const resizer = document.createElement('div');
            resizer.setAttribute('data-resizer', 'true');
            resizer.style.cssText = `width: 20px; height: 20px; background-color: ${isLightMode ? '#999' : '#666'}; position: absolute; right: 0; bottom: 0; cursor: se-resize; border-radius: 0 0 5px 0; display: ${isEditMode ? 'flex' : 'none'}; align-items: center; justify-content: center; color: white; font-size: 12px; transition: background-color 0.2s; z-index: 9910;`;
            resizer.innerHTML = '⮧';

            function handleResize(mouseEvent) {
                mouseEvent.preventDefault();
                mouseEvent.stopPropagation();
                state.isGlobalResizing = true;
                element.querySelectorAll('[data-timer-id], [data-flash-interval]').forEach(el => {
                    const timerId = el.dataset.timerId;
                    const flashId = el.dataset.flashInterval;
                    if (timerId) clearInterval(Number(timerId));
                    if (flashId) clearInterval(Number(flashId));
                });
                const startX = mouseEvent.clientX;
                const startY = mouseEvent.clientY;
                const startWidth = element.offsetWidth;
                const startHeight = element.offsetHeight;
                const contentContainer = element.querySelector('.content-container');
                const contentHeight = contentContainer ? contentContainer.scrollHeight + 60 : CONSTANTS.MIN_GROUP_HEIGHT;
                const minHeight = Math.max(CONSTANTS.MIN_GROUP_HEIGHT, contentHeight);
                const sidebar = document.getElementById('enhanced-sidebar');
                const sidebarRect = sidebar.getBoundingClientRect();
                const elementRect = element.getBoundingClientRect();

                function resize(moveEvent) {
                    const deltaX = moveEvent.clientX - startX;
                    const deltaY = moveEvent.clientY - startY;
                    let newWidth = Math.max(CONSTANTS.MIN_GROUP_WIDTH, startWidth + deltaX);
                    let newHeight = Math.max(minHeight, startHeight + deltaY);
                    const maxWidth = sidebarRect.right - elementRect.left - 20;
                    const maxHeight = sidebarRect.bottom - elementRect.top - 20;
                    newWidth = Math.min(newWidth, maxWidth);
                    newHeight = Math.min(newHeight, maxHeight);
                    element.style.width = `${newWidth}px`;
                    element.style.height = `${newHeight}px`;
                }

                function stopResize() {
                    document.removeEventListener('mousemove', resize);
                    document.removeEventListener('mouseup', stopResize);
                    state.isGlobalResizing = false;
                    const exactWidth = parseInt(element.style.width);
                    const exactHeight = parseInt(element.style.height);
                    if (onResize) onResize(exactWidth, exactHeight);
                    setTimeout(() => refreshSidebar(), 100);
                }
                document.addEventListener('mousemove', resize);
                document.addEventListener('mouseup', stopResize);
            }
            resizer.addEventListener('mousedown', handleResize);
            resizer.addEventListener('mouseover', () => {
                if (state.isEditMode) resizer.style.backgroundColor = state.isLightMode ? '#aaa' : '#777';
            });
            resizer.addEventListener('mouseout', () => {
                resizer.style.backgroundColor = state.isLightMode ? '#999' : '#666';
            });
            return resizer;
        },
        createAddButton: (theme, label = '+', onClick) => {
            const button = document.createElement('button');
            button.textContent = label;
            button.className = 'no-drag';
            button.style.cssText = `background-color: ${theme.SUCCESS}; color: white; border: none; padding: 3px 7px; cursor: pointer; border-radius: 3px; font-size: ${label === '+' ? '16px' : '18px'};`;
            button.addEventListener('click', onClick);
            button.addEventListener('mouseover', () => button.style.backgroundColor = utils.getLighterColor(theme.SUCCESS));
            button.addEventListener('mouseout', () => button.style.backgroundColor = theme.SUCCESS);
            return button;
        },
        createDeleteButton: (theme, label = '', onClick) => {
            const button = document.createElement('button');
            const img = document.createElement('img');
            img.src = chrome.runtime.getURL('assets/X.svg');
            img.alt = 'Delete';
            img.style.cssText = 'width: 16px; height: 16px; vertical-align: middle;';
            button.appendChild(img);
            button.className = 'no-drag';
            button.style.cssText = `background-color: ${theme.DANGER}; color: white; border: none; padding: 3px 7px; cursor: pointer; border-radius: 3px; font-size: ${label === '' ? '14px' : '12px'};`;
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                onClick();
            });
            button.addEventListener('mouseover', () => button.style.backgroundColor = utils.getLighterColor(theme.DANGER));
            button.addEventListener('mouseout', () => button.style.backgroundColor = theme.DANGER);
            return button;
        },
        createOverlay: (theme) => {
            const overlay = document.createElement('div');
            overlay.style.cssText = `position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.7); display: flex; align-items: center; justify-content: center; z-index: 992000;`;
            return overlay;
        },
        createDialogContainer: (title, theme) => {
            const dialog = document.createElement('div');
            dialog.style.cssText = `background: ${theme.HEADER}; padding: 20px; border-radius: 5px; min-width: 300px; border: 1px solid ${theme.BORDER}; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);`;
            dialog.innerHTML = `<h3 style="color: ${theme.TEXT}; margin: 0 0 15px 0;">${title}</h3>`;
            return dialog;
        },
        createDialogButtons: (theme) => `<div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;"><button type="button" class="cancelBtn" style="padding: 5px 15px; border-radius: 3px; border: none; background: ${theme.BUTTON_BG}; color: ${theme.TEXT}; cursor: pointer;">Cancel</button><button type="submit" style="padding: 5px 15px; border-radius: 3px; border: none; background: ${theme.SUCCESS}; color: white; cursor: pointer;">OK</button></div>`,
        createEmojiButtons: (theme) => {
            const containerId = `emoji-picker-${Math.random().toString(36).slice(2)}`;
            setTimeout(() => loadEmojiPicker(containerId, theme), 0);
            return `
            <div style="margin-top: 5px;">
            <button type="button" class="show-emoji-btn no-drag"
            style="background: ${theme.BUTTON_BG}; color: ${theme.TEXT};
            border: 1px solid ${theme.BORDER}; padding: 5px 10px;
            border-radius: 3px; cursor: pointer;">
            Show Emojis
            </button>
            <div id="${containerId}"
            style="margin-top: 5px; font-size: 18px; border: 1px solid ${theme.BORDER};
            border-radius: 5px; background: ${theme.BG}; display: none;">
            <div class="emoji-categories" style="display: flex; border-bottom: 1px solid ${theme.BORDER}; padding: 5px;">
            <button type="button" class="category-btn active" data-category="smileys" style="background: none; border: none; cursor: pointer; padding: 5px; opacity: 0.7;">😊</button>
            <button type="button" class="category-btn" data-category="gestures" style="background: none; border: none; cursor: pointer; padding: 5px; opacity: 0.7;">👋</button>
            <button type="button" class="category-btn" data-category="people" style="background: none; border: none; cursor: pointer; padding: 5px; opacity: 0.7;">👤</button>
            <button type="button" class="category-btn" data-category="nature" style="background: none; border: none; cursor: pointer; padding: 5px; opacity: 0.7;">🌿</button>
            <button type="button" class="category-btn" data-category="food" style="background: none; border: none; cursor: pointer; padding: 5px; opacity: 0.7;">🍔</button>
            <button type="button" class="category-btn" data-category="activities" style="background: none; border: none; cursor: pointer; padding: 5px; opacity: 0.7;">⚽</button>
            <button type="button" class="category-btn" data-category="objects" style="background: none; border: none; cursor: pointer; padding: 5px; opacity: 0.7;">💡</button>
            <button type="button" class="category-btn" data-category="symbols" style="background: none; border: none; cursor: pointer; padding: 5px; opacity: 0.7;">❤️</button>
            <button type="button" class="category-btn" data-category="travel" style="background: none; border: none; cursor: pointer; padding: 5px; opacity: 0.7;">🌍</button>
            </div>
            <div class="emoji-container" style="max-height: 200px; overflow-y: auto; padding: 10px;"></div>
            </div>
            </div>`;
        }
    };
    async function loadEmojiPicker(containerId, theme) {
        const container = document.getElementById(containerId);
        if (!container) return;
        const showButton = container.parentElement.querySelector('.show-emoji-btn');
        if (showButton) {
            showButton.addEventListener('click', () => {
                if (container.style.display === 'none') {
                    container.style.display = 'flex';
                    showButton.textContent = 'Hide Emojis';
                } else {
                    container.style.display = 'none';
                    showButton.textContent = 'Show Emojis';
                }
            });
        }
        if (!container) return;
        container.style.cssText = `
        width: 320px;
        height: 360px;
        display: none;
        flex-direction: column;
        overflow: hidden;
        border-radius: 6px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        background: ${theme.BG || '#ffffff'};
        `;
        try {
            const text = await fetch(chrome.runtime.getURL("assets/emoji-test.txt")).then(r => r.text());
            const allLines = text.split("\n");
            const emojiCategories = {
                smileys: {
                    name: "Smileys",
                    subgroups: {},
                    emojis: []
                },
                gestures: {
                    name: "Gestures",
                    subgroups: {},
                    emojis: []
                },
                people: {
                    name: "People",
                    subgroups: {},
                    emojis: []
                },
                nature: {
                    name: "Nature",
                    subgroups: {},
                    emojis: []
                },
                food: {
                    name: "Food",
                    subgroups: {},
                    emojis: []
                },
                activities: {
                    name: "Activities",
                    subgroups: {},
                    emojis: []
                },
                objects: {
                    name: "Objects",
                    subgroups: {},
                    emojis: []
                },
                symbols: {
                    name: "Symbols",
                    subgroups: {},
                    emojis: []
                },
                travel: {
                    name: "Travel",
                    subgroups: {},
                    emojis: []
                }
            };
            let currentGroup = '';
            let currentSubgroup = '';
            allLines.forEach(line => {
                if (line.startsWith('# group:')) {
                    currentGroup = line.split(':')[1].trim();
                } else if (line.startsWith('# subgroup:')) {
                    currentSubgroup = line.split(':')[1].trim();
                } else if (line.includes('; fully-qualified')) {
                    const [hexCode, ...descParts] = line.split(';');
                    const descriptionPart = descParts.join(';');
                    const description = descriptionPart.split('#')[1].trim();
                    const emoji = String.fromCodePoint(...hexCode.trim().split(' ').map(c => parseInt(c, 16)));
                    const isSkinToneVariant = hexCode.includes('1F3FB') ||
                        hexCode.includes('1F3FC') ||
                        hexCode.includes('1F3FD') ||
                        hexCode.includes('1F3FE') ||
                        hexCode.includes('1F3FF');
                    const emojiObj = {
                        emoji,
                        description,
                        variants: [],
                        subgroup: currentSubgroup,
                        isSkinTone: isSkinToneVariant,
                        baseHexCode: hexCode.trim()
                    };
                    const baseHexCode = hexCode.trim().split(' ').filter(code =>
                        !['1F3FB', '1F3FC', '1F3FD', '1F3FE', '1F3FF'].includes(code)
                    ).join(' ');
                    if (isSkinToneVariant) {
                        for (const categoryKey in emojiCategories) {
                            const category = emojiCategories[categoryKey];
                            for (const subgroupKey in category.subgroups) {
                                const baseEmoji = category.subgroups[subgroupKey].find(e =>
                                    e.baseHexCode === baseHexCode
                                );
                                if (baseEmoji) {
                                    baseEmoji.variants.push(emojiObj);
                                    break;
                                }
                            }
                        }
                    } else {
                        let targetCategory;
                        if (currentGroup === 'Smileys & Emotion') {
                            targetCategory = emojiCategories.smileys;
                        } else if (currentGroup === 'People & Body') {
                            targetCategory = currentSubgroup.toLowerCase().includes('hand') ?
                                emojiCategories.gestures : emojiCategories.people;
                        } else if (currentGroup === 'Animals & Nature') {
                            targetCategory = emojiCategories.nature;
                        } else if (currentGroup === 'Food & Drink') {
                            targetCategory = emojiCategories.food;
                        } else if (currentGroup === 'Activities') {
                            targetCategory = emojiCategories.activities;
                        } else if (currentGroup === 'Objects') {
                            targetCategory = emojiCategories.objects;
                        } else if (currentGroup === 'Symbols') {
                            targetCategory = emojiCategories.symbols;
                        } else if (currentGroup === 'Travel & Places') {
                            targetCategory = emojiCategories.travel;
                        }
                        if (targetCategory) {
                            if (!targetCategory.subgroups[currentSubgroup]) {
                                targetCategory.subgroups[currentSubgroup] = [];
                            }
                            targetCategory.subgroups[currentSubgroup].push(emojiObj);
                        }
                    }
                }
            });
            Object.keys(emojiCategories).forEach(category => {
                if (!emojiCategories[category].emojis?.length) {
                    emojiCategories[category].emojis = ['❓'];
                }
            });
            let emojiContainer = container.querySelector('.emoji-container');
            if (!emojiContainer) {
                emojiContainer = document.createElement('div');
                emojiContainer.className = 'emoji-container';
                container.appendChild(emojiContainer);
            }
            emojiContainer.style.cssText = `
        flex: 1;
        overflow-y: auto;
        padding: 8px;
        scrollbar-width: thin;
        scrollbar-color: ${theme.BORDER || '#e0e0e0'} transparent;
        `;
            const scrollbarStyles = document.createElement('style');
            scrollbarStyles.textContent = `
        .emoji-container::-webkit-scrollbar {
            width: 6px;
        }
        .emoji-container::-webkit-scrollbar-track {
            background: transparent;
        }
        .emoji-container::-webkit-scrollbar-thumb {
            background: ${theme.BORDER || '#e0e0e0'};
            border-radius: 3px;
        }
        `;
            document.head.appendChild(scrollbarStyles);
            const categoryButtons = container.querySelectorAll('.category-btn');

            function showCategory(categoryName) {
                const category = emojiCategories[categoryName];
                emojiContainer.innerHTML = '';
                const categoryTitle = document.createElement('div');
                categoryTitle.style.cssText = `
            color: ${theme.TEXT || '#333333'};
            font-size: 12px;
            font-weight: 500;
            margin: 0 0 6px;
            padding-bottom: 3px;
            border-bottom: 1px solid ${theme.BORDER || '#e0e0e0'};
            position: sticky;
            top: 0;
            background: ${theme.BG || '#ffffff'};
            z-index: 1;
            `;
                categoryTitle.textContent = category.name;
                emojiContainer.appendChild(categoryTitle);
                Object.entries(category.subgroups).forEach(([subgroupName, emojis]) => {
                    if (emojis.length === 0) return;
                    const subgroupDiv = document.createElement('div');
                    subgroupDiv.style.cssText = 'margin-bottom: 8px;';
                    const subgroupTitle = document.createElement('div');
                    subgroupTitle.style.cssText = `
                color: ${theme.subTEXT || (theme.TEXT + '99') || '#666666'};
                font-size: 10px;
                margin: 2px 0;
                padding-left: 2px;
                `;
                    subgroupTitle.textContent = subgroupName;
                    subgroupDiv.appendChild(subgroupTitle);
                    const emojiGrid = document.createElement('div');
                    emojiGrid.style.cssText = `
                display: grid;
                grid-template-columns: repeat(10, 1fr);
                gap: 2px;
                `;
                    emojis.forEach(emojiObj => {
                        const btnContainer = document.createElement('div');
                        btnContainer.style.cssText = 'position: relative; display: inline-block;';
                        const btn = document.createElement('button');
                        btn.textContent = emojiObj.emoji;
                        btn.title = emojiObj.description;
                        btn.type = 'button';
                        btn.style.cssText = `
                    border: none;
                    background: none;
                    cursor: pointer;
                    font-size: 15px;
                    padding: 3px;
                    border-radius: 3px;
                    transition: background-color 0.15s ease, transform 0.1s ease;
                    width: 100%;
                    height: 28px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    `;
                        if (emojiObj.variants && emojiObj.variants.length > 0) {
                            const variantsPopup = document.createElement('div');
                            variantsPopup.style.cssText = `
                        display: none;
                        position: absolute;
                        bottom: 110%;
                        left: 50%;
                        transform: translateX(-50%);
                        background: ${theme.BG || '#ffffff'};
                        border: 1px solid ${theme.BORDER || '#e0e0e0'};
                        border-radius: 4px;
                        padding: 2px;
                        z-index: 9999999;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                        grid-template-columns: repeat(6, 1fr);
                        gap: 1px;
                        max-width: 180px;
                        `;
                            [emojiObj, ...emojiObj.variants].forEach(emoji => {
                                const variantBtn = document.createElement('button');
                                variantBtn.textContent = emoji.emoji;
                                variantBtn.title = emoji.description;
                                variantBtn.type = 'button';
                                variantBtn.style.cssText = `
                            border: none;
                            background: none;
                            cursor: pointer;
                            padding: 3px;
                            font-size: 15px;
                            border-radius: 2px;
                            transition: background-color 0.15s;
                            width: 28px;
                            height: 28px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            `;
                                variantBtn.onclick = (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const input = container.closest('form').querySelector('[id^="itemEmoji_"], [id^="linkEmoji_"]');
                                    if (input) {
                                        input.value = emoji.emoji;
                                    }
                                    variantsPopup.style.display = 'none';
                                };
                                variantsPopup.appendChild(variantBtn);
                            });
                            btnContainer.appendChild(variantsPopup);
                            btnContainer.addEventListener('mouseenter', () => {
                                variantsPopup.style.display = 'grid';
                            });
                            btnContainer.addEventListener('mouseleave', () => {
                                variantsPopup.style.display = 'none';
                            });
                            btn.addEventListener('touchstart', (e) => {
                                e.preventDefault();
                                variantsPopup.style.display = 'grid';
                            }, {
                                passive: false
                            });
                            document.addEventListener('touchstart', (e) => {
                                if (!btnContainer.contains(e.target)) {
                                    variantsPopup.style.display = 'none';
                                }
                            }, {
                                passive: true
                            });
                        }
                        btn.addEventListener('click', () => {
                            const input = container.closest('form').querySelector('[id^="itemEmoji_"], [id^="linkEmoji_"]');
                            if (input) input.value = emojiObj.emoji;
                        });
                        btn.addEventListener('mouseover', () => {
                            btn.style.backgroundColor = theme.SECONDARY_BG || '#f0f0f0';
                            btn.style.transform = 'scale(1.05)';
                        });
                        btn.addEventListener('mouseout', () => {
                            btn.style.backgroundColor = 'transparent';
                            btn.style.transform = 'scale(1)';
                        });
                        btnContainer.appendChild(btn);
                        emojiGrid.appendChild(btnContainer);
                    });
                    subgroupDiv.appendChild(emojiGrid);
                    emojiContainer.appendChild(subgroupDiv);
                });
            }
            let categoryNav = container.querySelector('.category-nav');
            if (!categoryNav) {
                categoryNav = document.createElement('div');
                categoryNav.className = 'category-nav';
                categoryNav.style.cssText = `
            display: flex;
            justify-content: space-between;
            padding: 4px 6px;
            border-top: 1px solid ${theme.BORDER || '#e0e0e0'};
            background: ${theme.BG || '#ffffff'};
            `;
                container.appendChild(categoryNav);
            }
            if (!categoryButtons.length) {
                const categories = [{
                        id: 'smileys',
                        icon: '😊'
                    },
                    {
                        id: 'gestures',
                        icon: '👋'
                    },
                    {
                        id: 'people',
                        icon: '👤'
                    },
                    {
                        id: 'nature',
                        icon: '🐱'
                    },
                    {
                        id: 'food',
                        icon: '🍔'
                    },
                    {
                        id: 'activities',
                        icon: '⚽'
                    },
                    {
                        id: 'travel',
                        icon: '🚗'
                    },
                    {
                        id: 'objects',
                        icon: '💡'
                    },
                    {
                        id: 'symbols',
                        icon: '❤️'
                    }
                ];
                categories.forEach(cat => {
                    const btn = document.createElement('button');
                    btn.className = 'category-btn';
                    btn.dataset.category = cat.id;
                    btn.textContent = cat.icon;
                    btn.title = emojiCategories[cat.id].name;
                    btn.type = 'button';
                    btn.style.cssText = `
            border: none;
            background: none;
            cursor: pointer;
            font-size: 18px;
            opacity: 0.6;
            transition: opacity 0.2s, transform 0.2s;
            padding: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            `;
                    categoryNav.appendChild(btn);
                });
            }
            const updatedCategoryButtons = container.querySelectorAll('.category-btn');
            updatedCategoryButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    updatedCategoryButtons.forEach(b => {
                        b.style.opacity = '0.6';
                        b.classList.remove('active');
                        b.style.transform = 'scale(1)';
                    });
                    btn.style.opacity = '1';
                    btn.classList.add('active');
                    btn.style.transform = 'scale(1.15)';
                    showCategory(btn.dataset.category);
                });
                btn.addEventListener('mouseover', () => {
                    if (!btn.classList.contains('active')) {
                        btn.style.opacity = '0.9';
                        btn.style.transform = 'scale(1.1)';
                    }
                });
                btn.addEventListener('mouseout', () => {
                    if (!btn.classList.contains('active')) {
                        btn.style.opacity = '0.6';
                        btn.style.transform = 'scale(1)';
                    }
                });
            });
            showCategory('smileys');
            const defaultCategoryBtn = container.querySelector('[data-category="smileys"]');
            if (defaultCategoryBtn) {
                defaultCategoryBtn.style.opacity = '1';
                defaultCategoryBtn.classList.add('active');
                defaultCategoryBtn.style.transform = 'scale(1.15)';
            }
        } catch (err) {
            container.textContent = "⚠️ Failed to load emojis";
            console.error("Emoji fetch failed:", err);
        }
    }
    const dialogs = {
        confirmDelete: (message, theme, callback) => {
            const overlay = dom.createOverlay(theme);
            const dialog = dom.createDialogContainer(message, theme);
            dialog.innerHTML = `<p style="margin: 0 0 20px 0;">${message}</p><div style="display: flex; gap: 10px; justify-content: flex-end;"><button class="cancelBtn" style="padding: 5px 15px; border-radius: 3px; border: none; background: ${theme.BUTTON_BG}; color: ${theme.TEXT}; cursor: pointer;">Cancel</button><button class="confirmBtn" style="padding: 5px 15px; border-radius: 3px; border: none; background: ${theme.DANGER}; color: white; cursor: pointer;">Yes, Confirm</button></div>`;

            function cleanup() {
                document.body.removeChild(overlay);
            }
            dialog.querySelector('.cancelBtn').addEventListener('click', cleanup);
            dialog.querySelector('.confirmBtn').addEventListener('click', () => {
                cleanup();
                callback();
            });
            overlay.appendChild(dialog);
            document.body.appendChild(overlay);
            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    cleanup();
                    document.removeEventListener('keydown', handleEscape);
                }
            };
            document.addEventListener('keydown', handleEscape);
        },
        createPromptDialog: (title, fields, theme, existingDialogId = null) => {
            return new Promise((resolve) => {
                const dialogId = existingDialogId || 'dialog_' + Date.now();
                const overlay = dom.createOverlay(theme);
                const dialog = dom.createDialogContainer(title, theme);
                const fieldInputs = fields.map(field => `<div style="margin-bottom: 10px;"><label style="color: ${theme.TEXT}; display: block; margin-bottom: 5px;">${field.label}:</label><input type="${field.type || 'text'}" id="${field.id}_${dialogId}" style="width: 100%; padding: 5px; background: ${theme.BG}; border: 1px solid ${theme.BORDER}; color: ${theme.TEXT}; border-radius: 3px; ${field.type === 'checkbox' ? 'width: auto;' : ''}" ${field.type === 'checkbox' ? 'class="checkbox-input"' : ''}></div>`).join('');
                dialog.innerHTML += `<form id="promptForm_${dialogId}">${fieldInputs}${dom.createDialogButtons(theme)}</form>`;

                function cleanup() {
                    document.body.removeChild(overlay);
                    utils.safeStorage('remove', [dialogId]);
                }
                const form = dialog.querySelector(`#promptForm_${dialogId}`);
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const values = {};
                    fields.forEach(field => {
                        const input = document.getElementById(`${field.id}_${dialogId}`);
                        values[field.id] = field.type === 'checkbox' ? input.checked : input.value;
                    });
                    cleanup();
                    resolve(values);
                });
                dialog.querySelector('.cancelBtn').addEventListener('click', () => {
                    cleanup();
                    resolve(null);
                });
                overlay.appendChild(dialog);
                document.body.appendChild(overlay);
                utils.safeStorage('set', {
                    [dialogId]: {
                        type: 'prompt',
                        title,
                        fields
                    }
                });
                const firstInput = dialog.querySelector('input');
                if (firstInput) firstInput.focus();
                const handleEscape = (e) => {
                    if (e.key === 'Escape') {
                        cleanup();
                        resolve(null);
                        document.removeEventListener('keydown', handleEscape);
                    }
                };
                document.addEventListener('keydown', handleEscape);
            });
        },
        createLinkDialog: (groupIndex, theme, existingDialogId = null) => {
            return new Promise((resolve) => {
                const dialogId = existingDialogId || 'linkdialog' + Date.now();
                const overlay = dom.createOverlay(theme);
                const dialog = dom.createDialogContainer('Add Link', theme);
                dialog.innerHTML = `
            <form id="linkForm_${dialogId}">
            <div style="margin-bottom: 10px;">
            <label style="color: ${theme.TEXT}; display: block; margin-bottom: 5px;">Link Name:</label>
            <input type="text" id="linkName_${dialogId}" style="width: 100%; padding: 5px; background: ${theme.BG}; border: 1px solid ${theme.BORDER}; color: ${theme.TEXT}; border-radius: 3px;">
            </div>
            <div style="margin-bottom: 10px;">
            <label style="color: ${theme.TEXT}; display: block; margin-bottom: 5px;">Link URL:</label>
            <input type="text" id="linkUrl_${dialogId}" style="width: 100%; padding: 5px; background: ${theme.BG}; border: 1px solid ${theme.BORDER}; color: ${theme.TEXT}; border-radius: 3px;">
            </div>
            <div style="margin-bottom: 10px;">
            <label style="color: ${theme.TEXT}; display: block; margin-bottom: 5px;">Emoji:</label>
            <input type="text" id="linkEmoji_${dialogId}" style="width: 100%; padding: 5px; background: ${theme.BG}; border: 1px solid ${theme.BORDER}; color: ${theme.TEXT}; border-radius: 3px; margin-bottom: 5px;" placeholder="🔗">
        ${dom.createEmojiButtons(theme)}
        </div>
    ${dom.createDialogButtons(theme)}
    </form>
    `;

                function cleanup() {
                    document.body.removeChild(overlay);
                    utils.safeStorage('remove', [dialogId]);
                }
                const form = dialog.querySelector(`#linkForm_${dialogId}`);
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const name = document.getElementById(`linkName_${dialogId}`).value;
                    const url = document.getElementById(`linkUrl_${dialogId}`).value || window.location.href;
                    const emoji = document.getElementById(`linkEmoji_${dialogId}`).value;
                    if (name && url) {
                        state.groups[groupIndex].links.push({
                            name,
                            url,
                            emoji: emoji || '🔗'
                        });
                        utils.saveState(`${CONSTANTS.STATE_KEYS.GROUPS}_${state.currentPage}`, state.groups);
                        refreshSidebar();
                    }
                    cleanup();
                });
                dialog.querySelector('.cancelBtn').addEventListener('click', cleanup);
                overlay.appendChild(dialog);
                document.body.appendChild(overlay);
                utils.safeStorage('set', {
                    [dialogId]: {
                        type: 'link',
                        groupIndex
                    }
                });
                document.getElementById(`linkName_${dialogId}`).focus();
                const handleEscape = (e) => {
                    if (e.key === 'Escape') {
                        cleanup();
                        document.removeEventListener('keydown', handleEscape);
                    }
                };
                document.addEventListener('keydown', handleEscape);
            });
        },
        createLoanEntryDialog: (theme, existingDialogId = null) => {
            return new Promise((resolve) => {
                const dialogId = existingDialogId || 'loandialog' + Date.now();
                const overlay = dom.createOverlay(theme);
                const dialog = dom.createDialogContainer('Add Loan Entry', theme);
                dialog.innerHTML = `<form id="loanEntryForm_${dialogId}"><div style="margin-bottom: 10px;"><label style="color: ${theme.TEXT}; display: block; margin-bottom: 5px;">User:</label><input type="text" id="user_${dialogId}" style="width: 100%; padding: 5px; background: ${theme.BG}; border: 1px solid ${theme.BORDER}; color: ${theme.TEXT}; border-radius: 3px;"></div><div style="margin-bottom: 10px;"><label style="color: ${theme.TEXT}; display: block; margin-bottom: 5px;">Amount:</label><input type="text" id="amount_${dialogId}" placeholder="Enter amount (e.g., 1,000,000)" style="width: 100%; padding: 5px; background: ${theme.BG}; border: 1px solid ${theme.BORDER}; color: ${theme.TEXT}; border-radius: 3px;"></div><div style="margin-bottom: 10px;"><label style="color: ${theme.TEXT}; display: block; margin-bottom: 5px;">Due Date (Optional):</label><input type="date" id="dueDate_${dialogId}" style="width: 100%; padding: 5px; background: ${theme.BG}; border: 1px solid ${theme.BORDER}; color: ${theme.TEXT}; border-radius: 3px;"></div><div style="margin-bottom: 10px;"><label style="color: ${theme.TEXT}; display: block; margin-bottom: 5px;">Notes (Optional):</label><textarea id="notes_${dialogId}" style="width: 100%; height: 60px; padding: 5px; background: ${theme.BG}; border: 1px solid ${theme.BORDER}; color: ${theme.TEXT}; border-radius: 3px; resize: none;"></textarea></div>${dom.createDialogButtons(theme)}</form>`;

                function cleanup() {
                    document.body.removeChild(overlay);
                    utils.safeStorage('remove', [dialogId]);
                }
                const amountInput = dialog.querySelector(`#amount_${dialogId}`);
                amountInput.addEventListener('input', (e) => {
                    let value = e.target.value.replace(/[^\d]/g, '');
                    if (value) {
                        value = parseInt(value).toLocaleString();
                        e.target.value = value;
                    }
                });
                dialog.querySelector('.cancelBtn').addEventListener('click', () => {
                    cleanup();
                    resolve(null);
                });
                dialog.querySelector('form').addEventListener('submit', (e) => {
                    e.preventDefault();
                    const user = document.getElementById(`user_${dialogId}`).value.trim();
                    const amountStr = document.getElementById(`amount_${dialogId}`).value;
                    const amount = parseFloat(amountStr.replace(/,/g, ''));
                    const dueDate = document.getElementById(`dueDate_${dialogId}`).value;
                    const notes = document.getElementById(`notes_${dialogId}`).value.trim();
                    if (!user) {
                        alert('Please enter a user name');
                        return;
                    }
                    if (!amountStr || isNaN(amount) || amount <= 0) {
                        alert('Please enter a valid amount');
                        return;
                    }
                    cleanup();
                    resolve({
                        user,
                        amount,
                        dueDate: dueDate || null,
                        notes: notes || '',
                        created: Date.now(),
                        payments: []
                    });
                });
                overlay.appendChild(dialog);
                document.body.appendChild(overlay);
                utils.safeStorage('set', {
                    [dialogId]: {
                        type: 'loanEntry'
                    }
                });
                document.getElementById(`user_${dialogId}`).focus();
                const handleEscape = (e) => {
                    if (e.key === 'Escape') {
                        cleanup();
                        resolve(null);
                        document.removeEventListener('keydown', handleEscape);
                    }
                };
                document.addEventListener('keydown', handleEscape);
            });
        },
        createAuctionEntryDialog: (theme, existingDialogId = null) => {
            return new Promise((resolve) => {
                const dialogId = existingDialogId || 'auctiondialog' + Date.now();
                const overlay = dom.createOverlay(theme);
                const dialog = dom.createDialogContainer('Add Auction Entry', theme);
                dialog.innerHTML = `<form id="auctionEntryForm_${dialogId}"><div style="margin-bottom: 10px;"><label style="color: ${theme.TEXT}; display: block; margin-bottom: 5px;">Item:</label><input type="text" id="item_${dialogId}" style="width: 100%; padding: 5px; background: ${theme.BG}; border: 1px solid ${theme.BORDER}; color: ${theme.TEXT}; border-radius: 3px;"></div><div style="margin-bottom: 10px;"><label style="color: ${theme.TEXT}; display: block; margin-bottom: 5px;">Seller:</label><input type="text" id="seller_${dialogId}" style="width: 100%; padding: 5px; background: ${theme.BG}; border: 1px solid ${theme.BORDER}; color: ${theme.TEXT}; border-radius: 3px;"></div><div style="margin-bottom: 10px;"><label style="color: ${theme.TEXT}; display: block; margin-bottom: 5px;">Time Left:</label><div style="display: flex; gap: 10px; margin-bottom: 10px;"><div style="flex: 1;"><label style="color: ${theme.TEXT}; display: block; margin-bottom: 5px;">Days:</label><input type="number" id="timeDays_${dialogId}" min="0" value="0" style="width: 100%; padding: 5px; background: ${theme.BG}; border: 1px solid ${theme.BORDER}; color: ${theme.TEXT}; border-radius: 3px;"></div><div style="flex: 1;"><label style="color: ${theme.TEXT}; display: block; margin-bottom: 5px;">Hours:</label><input type="number" id="timeHours_${dialogId}" min="0" max="23" value="0" style="width: 100%; padding: 5px; background: ${theme.BG}; border: 1px solid ${theme.BORDER}; color: ${theme.TEXT}; border-radius: 3px;"></div><div style="flex: 1;"><label style="color: ${theme.TEXT}; display: block; margin-bottom: 5px;">Minutes:</label><input type="number" id="timeMinutes_${dialogId}" min="0" max="59" value="0" style="width: 100%; padding: 5px; background: ${theme.BG}; border: 1px solid ${theme.BORDER}; color: ${theme.TEXT}; border-radius: 3px;"></div></div></div>${dom.createDialogButtons(theme)}</form>`;

                function cleanup() {
                    document.body.removeChild(overlay);
                    utils.safeStorage('remove', [dialogId]);
                }
                dialog.querySelector('.cancelBtn').addEventListener('click', () => {
                    cleanup();
                    resolve(null);
                });
                dialog.querySelector('form').addEventListener('submit', (e) => {
                    e.preventDefault();
                    const item = document.getElementById(`item_${dialogId}`).value.trim();
                    const seller = document.getElementById(`seller_${dialogId}`).value.trim();
                    const days = parseInt(document.getElementById(`timeDays_${dialogId}`).value) || 0;
                    const hours = parseInt(document.getElementById(`timeHours_${dialogId}`).value) || 0;
                    const minutes = parseInt(document.getElementById(`timeMinutes_${dialogId}`).value) || 0;
                    if (!item) {
                        alert('Please enter an item name');
                        return;
                    }
                    if (!seller) {
                        alert('Please enter a seller name');
                        return;
                    }
                    if (days === 0 && hours === 0 && minutes === 0) {
                        alert('Please enter a valid time value');
                        return;
                    }
                    const totalMinutes = (days * 24 * 60) + (hours * 60) + minutes;
                    cleanup();
                    resolve({
                        item,
                        seller,
                        timeLeft: totalMinutes
                    });
                });
                overlay.appendChild(dialog);
                document.body.appendChild(overlay);
                utils.safeStorage('set', {
                    [dialogId]: {
                        type: 'auctionEntry'
                    }
                });
                document.getElementById(`item_${dialogId}`).focus();
                const handleEscape = (e) => {
                    if (e.key === 'Escape') {
                        cleanup();
                        resolve(null);
                        document.removeEventListener('keydown', handleEscape);
                    }
                };
                document.addEventListener('keydown', handleEscape);
            });
        },
        createManualCountdownDialog: async (theme) => {
            return new Promise((resolve) => {
                const dialogId = 'countdowndialog' + Date.now();
                const overlay = dom.createOverlay(theme);
                const dialog = dom.createDialogContainer('Add Custom Countdown', theme);
                dialog.innerHTML = `
        <form id="countdownForm_${dialogId}">
        <div style="margin-bottom: 10px;">
        <label style="color: ${theme.TEXT}; display: block; margin-bottom: 5px;">Countdown Name:</label>
        <input type="text" id="name_${dialogId}" style="width: 100%; padding: 5px; background: ${theme.BG}; border: 1px solid ${theme.BORDER}; color: ${theme.TEXT}; border-radius: 3px;">
        </div>
        <div style="margin-bottom: 10px;">
        <div style="color: ${theme.TEXT}; margin-bottom: 5px; font-weight: bold;">Select Time Input Method:</div>
        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
        <label style="color:${theme.subTEXT}; display: flex; align-items: center; gap: 5px;">
        <input type="radio" name="timeMethod_${dialogId}" value="duration" checked>
        Duration
        </label>
        <label style="color:${theme.subTEXT}; display: flex; align-items: center; gap: 5px;">
        <input type="radio" name="timeMethod_${dialogId}" value="datetime">
        Date/Time
        </label>
        </div>
        </div>
        <div id="durationInputs_${dialogId}">
        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
        <div style="flex: 1;">
        <label style="color: ${theme.TEXT}; display: block; margin-bottom: 5px;">Days:</label>
        <input type="number" id="timeDays_${dialogId}" min="0" value="0" style="width: 100%; padding: 5px; background: ${theme.BG}; border: 1px solid ${theme.BORDER}; color: ${theme.TEXT}; border-radius: 3px;">
        </div>
        <div style="flex: 1;">
        <label style="color: ${theme.TEXT}; display: block; margin-bottom: 5px;">Hours:</label>
        <input type="number" id="timeHours_${dialogId}" min="0" max="23" value="0" style="width: 100%; padding: 5px; background: ${theme.BG}; border: 1px solid ${theme.BORDER}; color: ${theme.TEXT}; border-radius: 3px;">
        </div>
        <div style="flex: 1;">
        <label style="color: ${theme.TEXT}; display: block; margin-bottom: 5px;">Minutes:</label>
        <input type="number" id="timeMinutes_${dialogId}" min="0" max="59" value="0" style="width: 100%; padding: 5px; background: ${theme.BG}; border: 1px solid ${theme.BORDER}; color: ${theme.TEXT}; border-radius: 3px;">
        </div>
        </div>
        </div>
        <div id="dateTimeInputs_${dialogId}" style="display: none;">
        <div style="display: flex; gap: 10px;">
        <div style="flex: 2;">
        <label style="color: ${theme.TEXT}; display: block; margin-bottom: 5px;">End Date:</label>
        <input type="date" id="endDate_${dialogId}" style="width: 100%; padding: 5px; background: ${theme.BG}; border: 1px solid ${theme.BORDER}; color: ${theme.TEXT}; border-radius: 3px;">
        </div>
        <div style="flex: 1;">
        <label style="color: ${theme.TEXT}; display: block; margin-bottom: 5px;">End Time:</label>
        <input type="time" id="endTime_${dialogId}" style="width: 100%; padding: 5px; background: ${theme.BG}; border: 1px solid ${theme.BORDER}; color: ${theme.TEXT}; border-radius: 3px;">
        </div>
        </div>
        </div>
    ${dom.createDialogButtons(theme)}
    </form>
    `;

                function cleanup() {
                    document.body.removeChild(overlay);
                    utils.safeStorage('remove', [dialogId]);
                }
                const radioButtons = dialog.querySelectorAll(`input[name="timeMethod_${dialogId}"]`);
                const durationInputs = dialog.querySelector(`#durationInputs_${dialogId}`);
                const dateTimeInputs = dialog.querySelector(`#dateTimeInputs_${dialogId}`);
                radioButtons.forEach(radio => {
                    radio.addEventListener('change', (e) => {
                        if (e.target.value === 'duration') {
                            durationInputs.style.display = 'block';
                            dateTimeInputs.style.display = 'none';
                        } else {
                            durationInputs.style.display = 'none';
                            dateTimeInputs.style.display = 'block';
                        }
                    });
                });
                const form = dialog.querySelector('form');
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const name = document.getElementById(`name_${dialogId}`).value.trim();
                    const timeMethod = dialog.querySelector(`input[name="timeMethod_${dialogId}"]:checked`).value;
                    let endTime;
                    if (timeMethod === 'duration') {
                        const days = parseInt(document.getElementById(`timeDays_${dialogId}`).value) || 0;
                        const hours = parseInt(document.getElementById(`timeHours_${dialogId}`).value) || 0;
                        const minutes = parseInt(document.getElementById(`timeMinutes_${dialogId}`).value) || 0;
                        if (days === 0 && hours === 0 && minutes === 0) {
                            alert('Please enter a valid duration');
                            return;
                        }
                        const totalMinutes = (days * 24 * 60) + (hours * 60) + minutes;
                        endTime = Date.now() + (totalMinutes * 60 * 1000);
                    } else {
                        const date = document.getElementById(`endDate_${dialogId}`).value;
                        const time = document.getElementById(`endTime_${dialogId}`).value;
                        if (!date || !time) {
                            alert('Please enter both date and time');
                            return;
                        }
                        endTime = new Date(`${date}T${time}`).getTime();
                    }
                    if (!name) {
                        alert('Please enter a countdown name');
                        return;
                    }
                    cleanup();
                    resolve({
                        name,
                        endTime
                    });
                });
                dialog.querySelector('.cancelBtn').addEventListener('click', () => {
                    cleanup();
                    resolve(null);
                });
                overlay.appendChild(dialog);
                document.body.appendChild(overlay);
                document.getElementById(`name_${dialogId}`).focus();
            });
        }
    };
    const components = {
        createSidebar: () => {
            const existingSidebar = document.getElementById('enhanced-sidebar');
            if (existingSidebar) {
                return existingSidebar;
            }
            const theme = utils.getTheme();
            const persistentState = utils.loadState(CONSTANTS.STATE_KEYS.SIDEBAR_STATE, {
                isHidden: false
            });
            const sidebar = document.createElement('div');
            if (!sidebar) {
                console.error('Failed to create sidebar element');
                return null;
            }
            try {
                sidebar.id = 'enhanced-sidebar';
                sidebar.style.cssText = `
                position: fixed;
                top: 0;
                ${state.isSidebarRight ? 'right' : 'left'}: 0;
                width: ${CONSTANTS.SIDEBAR_WIDTH}px;
                height: 100%;
                background-color: ${theme.BG};
                color: ${theme.TEXT};
                z-index: 991000;
                display: flex;
                flex-direction: column;
                border-${state.isSidebarRight ? 'left' : 'right'}: 2px solid ${theme.BORDER};
                transition: transform 0.3s ease-in-out;
                transform: translateX(${persistentState.isHidden ? (state.isSidebarRight ? '-102%' : '-102%') : '0'});
                will-change: transform;
                overflow-x: hidden;
                box-sizing: border-box;
            `;
                sidebar.style.msOverflowStyle = 'none';
                sidebar.style.scrollbarWidth = 'none';
                sidebar.addEventListener('scroll', () => sidebar.style.overflowY = 'hidden');
                const topBar = components.createTopBar();
                const groupContainer = components.createGroupContainer();
                const tagline = components.createTagline();
                const pageSelector = components.createPageSelector(theme);
                pageSelector.style.cssText = `
            position: absolute;
            bottom: 50px;
            left: 10px;
            z-index: 991101;
            `;
                sidebar.appendChild(topBar);
                sidebar.appendChild(groupContainer);
                sidebar.appendChild(tagline);
                sidebar.appendChild(pageSelector);
                document.body.appendChild(sidebar);
                setupDragListeners(groupContainer);
                refreshSidebar();
                const toggleButton = components.createToggleButton(sidebar);
                document.body.appendChild(toggleButton);
            } catch (error) {
                console.error('Error creating sidebar:', error);
                return null;
            }
            return sidebar;
        },
        createToggleButton: (sidebar) => {
            const toggleButton = document.createElement('button');
            toggleButton.id = 'sidebar-toggle';
            const img = document.createElement('img');
            img.src = chrome.runtime.getURL('assets/menu.svg');
            img.alt = 'Menu';
            img.style.cssText = 'width: 24px; height: 24px; vertical-align: middle; filter: invert(1);';
            toggleButton.appendChild(img);
            toggleButton.title = 'Toggle SideWinder';
            const theme = utils.getTheme();
            const sidebarState = utils.loadState(CONSTANTS.STATE_KEYS.SIDEBAR_STATE, {
                isHidden: false
            });
            toggleButton.style.cssText = `position: fixed; background-color: ${sidebarState.isHidden ? '#333333' : '#444444'}; color: ${theme.TEXT}; border: none; padding: 12px; cursor: pointer; z-index: 999999; transition: transform 0.3s ease-in-out, background-color 0.2s ease; border-radius: 4px; visibility: visible !important; opacity: 1 !important; box-shadow: 0 2px 5px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; min-width: 48px; min-height: 48px; transform: ${sidebarState.isHidden ? 'rotate(180deg)' : 'rotate(0deg)'};`;
            const savedBtnPos = localStorage.getItem('sidebarBtnPos') || 'top-left';
            setTimeout(() => updateSidebarBtnPosition(savedBtnPos), 0);
            toggleButton.addEventListener('click', () => {
                const currentState = utils.loadState(CONSTANTS.STATE_KEYS.SIDEBAR_STATE, {
                    isHidden: false
                });
                const newHiddenState = !currentState.isHidden;
                utils.saveState(CONSTANTS.STATE_KEYS.SIDEBAR_STATE, {
                    isHidden: newHiddenState
                });
                requestAnimationFrame(() => {
                    sidebar.style.transform = newHiddenState ?
                        `translateX(${state.isSidebarRight ? '-102%' : '-102%'})` :
                        'translateX(0)';
                    toggleButton.style.transform = newHiddenState ? 'rotate(180deg)' : 'rotate(0deg)';
                    toggleButton.style.backgroundColor = newHiddenState ? '#333333' : '#444444';
                });
            });
            toggleButton.addEventListener('mouseover', () => {
                const currentState = utils.loadState(CONSTANTS.STATE_KEYS.SIDEBAR_STATE, {
                    isHidden: false
                });
                toggleButton.style.backgroundColor = currentState.isHidden ? '#2c2c2c' : '#333333';
            });
            toggleButton.addEventListener('mouseout', () => {
                const currentState = utils.loadState(CONSTANTS.STATE_KEYS.SIDEBAR_STATE, {
                    isHidden: false
                });
                toggleButton.style.backgroundColor = currentState.isHidden ? '#333333' : '#444444';
            });
            return toggleButton;
        },
        createGroupContainer: () => {
            const container = document.createElement('div');
            container.id = 'group-container';
            container.style.cssText = `flex-grow: 1; padding: 10px; margin-top: 50px; margin-bottom: 30px; position: relative; overflow-y: auto; overflow-x: hidden;`;
            return container;
        },
        createTagline: () => {
            const theme = utils.getTheme();
            const container = document.createElement('div');
            container.style.cssText = `position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); color: ${theme.TEXT}; font-style: italic; font-size: 14px; text-align: center; pointer-events: none; white-space: nowrap;`;
            container.textContent = CONSTANTS.TAGLINES[Math.floor(Math.random() * CONSTANTS.TAGLINES.length)];
            return container;
        },
        createTopBar: () => {
            const theme = utils.getTheme();
            const topBar = document.createElement('div');
            topBar.id = 'top-bar';
            topBar.style.cssText = `display: flex; justify-content: space-between; align-items: center; padding: 10px; background-color: #2c2c2c; border-bottom: 1px solid #444444; width: 100%; position: absolute; top: 0; height: 50px; box-sizing: border-box; z-index: 991101;`;
            const trademarkContainer = document.createElement('div');
            trademarkContainer.style.cssText = `position: absolute; left: 60px; color: white; font-style: italic; font-size: 14px; white-space: nowrap; pointer-events: none; margin-left: 10px;`;
            trademarkContainer.textContent = CONSTANTS.TRADEMARK;
            topBar.appendChild(trademarkContainer);
            const buttonsContainer = document.createElement('div');
            buttonsContainer.style.cssText = `display: flex; gap: 10px; align-items: center; margin-left: auto;`;
            const buttons = [{
                    id: 'clockButton',
                    icon: `<img src="${chrome.runtime.getURL('assets/clock.svg')}" alt="Clock" style="width:20px;height:20px;vertical-align:middle;pointer-events: none;">`,
                    color: '#444444',
                    action: actions.toggleClock,
                    title: 'Toggle Clock'
                },
                {
                    id: 'calculatorButton',
                    icon: `<img src="${chrome.runtime.getURL('assets/calculator.svg')}" alt="Calculator" style="width:20px;height:20px;vertical-align:middle;pointer-events: none;">`,
                    color: '#444444',
                    action: actions.showCalculator,
                    title: 'Calculator'
                },
                {
                    id: 'deleteButton',
                    icon: `<img src="${chrome.runtime.getURL('assets/delete_mode.svg')}" alt="Delete" style="width:20px;height:20px;vertical-align:middle;">`,
                    color: theme.DANGER,
                    action: actions.toggleDeleteMode,
                    title: 'Delete Mode'
                },
                {
                    id: 'editButton',
                    icon: `<img src="${chrome.runtime.getURL('assets/edit_mode.svg')}" alt="Edit" style="width:20px;height:20px;vertical-align:middle;">`,
                    color: '#444444',
                    action: actions.toggleEditMode,
                    title: 'Edit Mode'
                },
                {
                    id: 'addButton',
                    icon: `<img src="${chrome.runtime.getURL('assets/add.svg')}" alt="Add" style="width:32px;height:32px;vertical-align:middle;">`,
                    color: theme.SUCCESS,
                    action: actions.showAddMenu,
                    title: 'Add Group'
                }
            ];
            buttons.forEach(({
                id,
                icon,
                color,
                action,
                title
            }) => {
                const button = components.createModeButton(id, icon, color, action, title);
                buttonsContainer.appendChild(button);
            });
            topBar.appendChild(buttonsContainer);
            return topBar;
        },
        createPageSelector: (theme) => {
            const container = document.createElement('div');
            container.id = 'page-selector';
            container.style.cssText = `position: absolute; bottom: 50px; left: 50px; z-index: 991101; display: flex; gap: 10px; align-items: center;`;
            const tooltip = document.createElement('div');
            tooltip.textContent = 'Page Selector';
            tooltip.style.cssText = `position: absolute; background-color: ${theme.HEADER}; color: ${theme.TEXT}; padding: 5px 8px; border-radius: 4px; font-size: 12px; bottom: 0; right: -10px; transform: translateX(100%); white-space: nowrap; opacity: 0; visibility: hidden; transition: opacity 0.3s, visibility 0.3s; pointer-events: none; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);`;
            container.appendChild(tooltip);
            const currentPageCircle = document.createElement('div');
            currentPageCircle.style.cssText = `width: 30px; height: 30px; border-radius: 50%; background-color: ${theme.BottomButtonBG}; color: ${theme.TEXT}; display: flex; justify-content: center; align-items: center; cursor: pointer; font-weight: bold; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); transition: all 0.2s ease; position: relative;`;
            currentPageCircle.innerHTML = '📑';
            const img = document.createElement('img');
            img.src = chrome.runtime.getURL('assets/pages.svg');
            img.alt = 'Pages';
            img.style.cssText = `width: 12px; height: 12px; vertical-align: middle;`;
            currentPageCircle.textContent = '';
            currentPageCircle.appendChild(img);
            container.appendChild(currentPageCircle);
            currentPageCircle.addEventListener('mouseenter', () => {
                tooltip.style.opacity = '1';
                tooltip.style.visibility = 'visible';
            });
            currentPageCircle.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0';
                tooltip.style.visibility = 'hidden';
            });
            const pageMenu = document.createElement('div');
            pageMenu.id = 'page-menu';
            pageMenu.style.cssText = `position: absolute; left: 0; bottom: 40px; display: none; flex-direction: column-reverse; gap: 10px; z-index: 991200; transition: all 0.3s ease; padding-bottom: 5px;`;

            function setupPageCircleEvents(pageCircle, pageIndex) {
                pageCircle.addEventListener('mouseover', () => {
                    if (pageIndex !== state.currentPage) {
                        pageCircle.style.backgroundColor = theme.SECONDARY_BG;
                        pageCircle.style.transform = 'scale(1.1)';
                    }
                });
                pageCircle.addEventListener('mouseout', () => {
                    if (pageIndex !== state.currentPage) {
                        pageCircle.style.backgroundColor = theme.BG;
                        pageCircle.style.transform = 'scale(1)';
                    }
                });
                pageCircle.addEventListener('click', () => {
                    if (pageIndex !== state.currentPage) {
                        actions.changePage(pageIndex);
                        showPageNumber(pageIndex + 1);
                        pageMenu.style.display = 'none';
                        isPageMenuOpen = false;
                    }
                });
            }

            function showPageNumber(number) {
                const originalContent = currentPageCircle.innerHTML;
                currentPageCircle.innerHTML = number;
                setTimeout(() => {
                    currentPageCircle.innerHTML = originalContent;
                }, 1000);
            }
            for (let i = 0; i < 3; i++) {
                const pageCircle = document.createElement('div');
                pageCircle.textContent = (i + 1);
                pageCircle.style.cssText = `width: 30px; height: 30px; border-radius: 50%; background-color: ${i === state.currentPage ? theme.BUTTON_BG : theme.BG}; color: ${theme.TEXT}; border: 1px solid ${theme.BORDER}; cursor: pointer; display: flex; justify-content: center; align-items: center; font-weight: bold; transition: background-color 0.2s ease, transform 0.2s ease; transform: scale(${i === state.currentPage ? 1.1 : 1});`;
                setupPageCircleEvents(pageCircle, i);
                pageMenu.appendChild(pageCircle);
            }
            container.appendChild(pageMenu);
            let isPageMenuOpen = false;
            currentPageCircle.addEventListener('click', () => {
                isPageMenuOpen = !isPageMenuOpen;
                if (isPageMenuOpen) {
                    pageMenu.style.display = 'flex';
                    currentPageCircle.style.transform = 'scale(1.1)';
                } else {
                    pageMenu.style.display = 'none';
                    currentPageCircle.style.transform = 'scale(1)';
                }
            });
            document.addEventListener('click', (e) => {
                if (!container.contains(e.target) && isPageMenuOpen) {
                    pageMenu.style.display = 'none';
                    isPageMenuOpen = false;
                    currentPageCircle.style.transform = 'scale(1)';
                }
            });
            return container;
        },
        createModeButton: (id, icon, color, action, title) => {
            const button = document.createElement('button');
            button.id = id;
            button.innerHTML = icon;
            button.title = title || '';
            const theme = utils.getTheme();
            let buttonColor;
            if (id === 'addButton') {
                buttonColor = theme.SUCCESS;
            } else if (id === 'deleteButton') {
                buttonColor = state.isDeleteMode ? theme.DANGER : "#444444";
            } else if (id === 'editButton') {
                buttonColor = state.isEditMode ? theme.SUCCESS : '#444444';
            } else if (id === 'clockButton') {
                buttonColor = state.clockVisible ? utils.getLighterColor('#444') : '#444';
            } else {
                buttonColor = color;
            }
            button.style.cssText = `background-color: ${buttonColor}; color: white; border: none; padding: 8px; font-size:16px; cursor: pointer; width: 36px; height: 36px; border-radius: 4px; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; box-shadow: none; position: relative;`;
            button.addEventListener('click', () => {
                utils.preserveSidebarAnimation();
                action();
                if (id === 'deleteButton') {
                    button.style.backgroundColor = state.isDeleteMode ? theme.DANGER : '#444444';
                } else if (id === 'editButton') {
                    button.style.backgroundColor = state.isEditMode ? theme.SUCCESS : '#444444';
                } else if (id === 'clockButton') {
                    button.style.backgroundColor = state.clockVisible ? utils.getLighterColor('#444') : '#444444';
                }
                const buttons = document.querySelectorAll('#top-bar button');
                buttons.forEach(btn => {
                    if ((btn.id === 'editButton' && state.isEditMode) || (btn.id === 'deleteButton' && state.isDeleteMode) || (btn.id === 'clockButton' && state.clockVisible) || (btn.id === 'calculatorButton' && state.calculatorVisible)) {
                        btn.style.boxShadow = '0 0 15px rgba(255, 255, 255, 0.5)';
                    } else {
                        btn.style.boxShadow = 'none';
                    }
                });
            });
            button.addEventListener('mouseover', () => {
                if (id === 'addButton') {
                    button.style.backgroundColor = utils.getLighterColor(theme.SUCCESS);
                } else if (id === 'deleteButton') {
                    button.style.backgroundColor = state.isDeleteMode ? utils.getLighterColor(theme.DANGER) : utils.getLighterColor('#444444');
                } else if (id === 'editButton') {
                    button.style.backgroundColor = state.isEditMode ? utils.getLighterColor(theme.SUCCESS) : utils.getLighterColor('#444444');
                } else {
                    button.style.backgroundColor = utils.getLighterColor(buttonColor);
                }
            });
            button.addEventListener('mouseout', () => {
                if (id === 'addButton') {
                    button.style.backgroundColor = theme.SUCCESS;
                } else if (id === 'deleteButton') {
                    button.style.backgroundColor = state.isDeleteMode ? theme.DANGER : '#444444';
                } else if (id === 'editButton') {} else {
                    button.style.backgroundColor = buttonColor;
                }
            });
            return button;
        }
    };
    const actions = {
        initializeState: () => {
            state.currentPage = utils.loadState(CONSTANTS.STATE_KEYS.CURRENT_PAGE, 0);
            state.pageData = utils.loadState(CONSTANTS.STATE_KEYS.PAGE_DATA, [{}, {}, {}]);
            actions.loadPageData();
            state.isLightMode = utils.loadState(CONSTANTS.STATE_KEYS.LIGHT_MODE, false);
            state.isSidebarRight = utils.loadState(CONSTANTS.STATE_KEYS.SIDEBAR_POSITION, false);
        },
        loadPageData: () => {
            state.groups = utils.loadState(`${CONSTANTS.STATE_KEYS.GROUPS}_${state.currentPage}`, []);
            state.notepads = utils.loadState(`${CONSTANTS.STATE_KEYS.NOTEPADS}_${state.currentPage}`, []);
            state.attackLists = utils.loadState(`${CONSTANTS.STATE_KEYS.ATTACK_LISTS}_${state.currentPage}`, []);
            state.todoLists = utils.loadState(`${CONSTANTS.STATE_KEYS.TODO_LISTS}_${state.currentPage}`, []);
            state.loanTracker = utils.loadState(`${CONSTANTS.STATE_KEYS.LOAN_TRACKER}_${state.currentPage}`, {
                entries: []
            });
            state.auctionTracker = utils.loadState(`${CONSTANTS.STATE_KEYS.AUCTION_TRACKER}_${state.currentPage}`, {
                auctions: []
            });
            state.countdownGroups = utils.loadState(`${CONSTANTS.STATE_KEYS.COUNTDOWN_GROUPS}_${state.currentPage}`, []);
            state.manualCountdownGroups = utils.loadState(`${CONSTANTS.STATE_KEYS.MANUAL_COUNTDOWN_GROUPS}_${state.currentPage}`, []);
        },
        savePageData: () => {
            utils.saveState(`${CONSTANTS.STATE_KEYS.GROUPS}_${state.currentPage}`, state.groups);
            utils.saveState(`${CONSTANTS.STATE_KEYS.NOTEPADS}_${state.currentPage}`, state.notepads);
            utils.saveState(`${CONSTANTS.STATE_KEYS.ATTACK_LISTS}_${state.currentPage}`, state.attackLists);
            utils.saveState(`${CONSTANTS.STATE_KEYS.TODO_LISTS}_${state.currentPage}`, state.todoLists);
            utils.saveState(`${CONSTANTS.STATE_KEYS.COUNTDOWN_GROUPS}_${state.currentPage}`, state.countdownGroups);
            utils.saveState(`${CONSTANTS.STATE_KEYS.MANUAL_COUNTDOWN_GROUPS}_${state.currentPage}`, state.manualCountdownGroups);
            utils.saveState(CONSTANTS.STATE_KEYS.CURRENT_PAGE, state.currentPage);
        },
        changePage: (pageNumber) => {
            actions.savePageData();
            state.currentPage = pageNumber;
            utils.saveState(CONSTANTS.STATE_KEYS.CURRENT_PAGE, state.currentPage);
            actions.loadPageData();
            refreshSidebar();
            utils.showToast(`Switched to Page ${pageNumber + 1}`, 'info');
        },
        toggleLightMode: () => {
            state.isLightMode = !state.isLightMode;
            utils.saveState(CONSTANTS.STATE_KEYS.LIGHT_MODE, state.isLightMode);
            updateAllElementStyles();
            utils.showToast(`Switched to ${state.isLightMode ? 'Light' : 'Dark'} Mode`, 'success');
        },
        showCalculator: () => {
            const existingCalculator = document.getElementById('calculator-modal');
            if (existingCalculator) {
                existingCalculator.parentNode.removeChild(existingCalculator);
                state.calculatorVisible = false;
                return;
            };
            state.calculatorVisible = true;
            const sidebar = document.getElementById('enhanced-sidebar');
            const theme = utils.getTheme();
            const styles = {
                dark: {
                    bg: '#111111',
                    displayBg: '#222222',
                    buttonBg: '#222222',
                    operatorBg: '#333333',
                    text: '#eeeeee',
                    subText: '#999999',
                    buttonHoverBg: '#333333',
                    operatorHoverBg: '#444444',
                    clearButtonBg: '#ff3333'
                },
                light: {
                    bg: '#ffffff',
                    displayBg: '#f5f5f5',
                    buttonBg: '#e8e8e8',
                    operatorBg: '#d4d4d4',
                    text: '#333333',
                    subText: '#666666',
                    buttonHoverBg: '#dadada',
                    operatorHoverBg: '#c4c4c4',
                    clearButtonBg: '#ff4444'
                }
            };
            const currentStyle = state.isLightMode ? styles.light : styles.dark;
            const calculatorContainer = document.createElement('div');
            calculatorContainer.id = 'calculator-modal';
            calculatorContainer.style.cssText = `
        position: absolute;
        top: 60px;
        right: 10px;
        width: 240px;
        background-color: ${currentStyle.bg};
        border-radius: 5px;
        padding: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 991500;
        font-family: 'Arial', sans-serif;
        border: 1px solid ${theme.BORDER};
        `;
            const header = document.createElement('div');
            header.style.cssText = `
        color: ${currentStyle.text};
        font-size: 16px;
        padding: 5px 0;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 10px;
        `;
            header.textContent = 'Calculator';
            calculatorContainer.appendChild(header);
            const display = document.createElement('div');
            display.id = 'calculator-display';
            display.style.cssText = `
        width: 100%;
        height: 50px;
        background-color: ${currentStyle.displayBg};
        color: ${currentStyle.text};
        border-radius: 5px;
        margin-bottom: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
        box-sizing: border-box;
        font-size: 20px;
        border: 1px solid ${theme.BORDER};
        `;
            const displayLabel = document.createElement('div');
            displayLabel.textContent = 'Result';
            displayLabel.style.cssText = `
        font-size: 14px;
        color: ${currentStyle.subText};
        `;
            const updateDisplayFontSize = (element, value) => {
                element.textContent = value;
                let fontSize = 20;
                if (value.length > 8) {
                    fontSize = 18;
                }
                if (value.length > 10) {
                    fontSize = 16;
                }
                if (value.length > 12) {
                    fontSize = 14;
                }
                if (value.length > 15) {
                    fontSize = 12;
                }
                if (value.length > 18) {
                    fontSize = 10;
                }
                if (value.length > 21) {
                    fontSize = 8;
                }
                element.style.fontSize = `${fontSize}px`;
            };
            const displayValue = document.createElement('div');
            displayValue.style.cssText = `
        text-align: right;
        flex-grow: 1;
        margin-left: 10px;
        color: ${currentStyle.text};
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        transition: font-size 0.1s ease;
        `;
            updateDisplayFontSize(displayValue, '0');
            display.appendChild(displayLabel);
            display.appendChild(displayValue);
            const keypad = document.createElement('div');
            keypad.style.cssText = `
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 5px;
        `;
            let currentValue = '0';
            let previousValue = null;
            let operation = null;
            let resetOnNextInput = true;
            const buttons = [{
                    text: '7',
                    type: 'number'
                },
                {
                    text: '8',
                    type: 'number'
                },
                {
                    text: '9',
                    type: 'number'
                },
                {
                    text: '÷',
                    type: 'operator',
                    value: '/'
                },
                {
                    text: '4',
                    type: 'number'
                },
                {
                    text: '5',
                    type: 'number'
                },
                {
                    text: '6',
                    type: 'number'
                },
                {
                    text: '×',
                    type: 'operator',
                    value: '*'
                },
                {
                    text: '1',
                    type: 'number'
                },
                {
                    text: '2',
                    type: 'number'
                },
                {
                    text: '3',
                    type: 'number'
                },
                {
                    text: '-',
                    type: 'operator'
                },
                {
                    text: '.',
                    type: 'decimal'
                },
                {
                    text: '0',
                    type: 'number'
                },
                {
                    text: '=',
                    type: 'equals'
                },
                {
                    text: '+',
                    type: 'operator'
                }
            ];
            const topRow = document.createElement('div');
            topRow.style.cssText = `
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 5px;
    margin-bottom: 5px;
    align-items: center;
    `;
            const clearButton = document.createElement('button');
            clearButton.textContent = 'C';
            clearButton.style.cssText = `
    background-color: ${currentStyle.clearButtonBg};
    color: white;
    border: none;
    padding: 12px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    height: 40px;
    `;
            clearButton.addEventListener('click', () => {
                currentValue = '0';
                previousValue = null;
                operation = null;
                resetOnNextInput = true;
                updateDisplayFontSize(displayValue, currentValue);
            });
            topRow.appendChild(display);
            topRow.appendChild(clearButton);
            calculatorContainer.appendChild(topRow);
            buttons.forEach(btn => {
                const button = document.createElement('button');
                button.textContent = btn.text;
                button.style.cssText = `
        background-color: ${btn.type === 'operator' || btn.type === 'equals' ? currentStyle.operatorBg : currentStyle.buttonBg};
        color: ${currentStyle.text};
        border: none;
        padding: 12px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        transition: transform 0.1s, background-color 0.1s;
        `;
                button.addEventListener('click', () => {
                    button.style.transform = 'scale(0.95)';
                    button.style.backgroundColor = btn.type === 'operator' || btn.type === 'equals' ?
                        currentStyle.operatorHoverBg : currentStyle.buttonHoverBg;
                    setTimeout(() => {
                        button.style.transform = 'scale(1)';
                        button.style.backgroundColor = btn.type === 'operator' || btn.type === 'equals' ?
                            currentStyle.operatorBg : currentStyle.buttonBg;
                    }, 100);
                    const value = btn.value || btn.text;
                    button.addEventListener('mouseover', () => {
                        button.style.backgroundColor = btn.type === 'operator' || btn.type === 'equals' ?
                            currentStyle.operatorHoverBg : currentStyle.buttonHoverBg;
                    });
                    button.addEventListener('mouseout', () => {
                        button.style.backgroundColor = btn.type === 'operator' || btn.type === 'equals' ?
                            currentStyle.operatorBg : currentStyle.buttonBg;
                    });
                    if (btn.type === 'decimal') {
                        if (!currentValue.includes('.')) {
                            currentValue = currentValue === '0' ? '0.' : currentValue + '.';
                        }
                    } else if (btn.type === 'number') {
                        if (resetOnNextInput) {
                            currentValue = value;
                            resetOnNextInput = false;
                        } else {
                            currentValue = currentValue === '0' ? value : currentValue + value;
                        }
                    } else if (btn.type === 'operator') {
                        previousValue = currentValue;
                        operation = btn.value || btn.text;
                        resetOnNextInput = true;
                    } else if (btn.type === 'equals') {
                        if (previousValue && operation) {
                            const prev = parseFloat(previousValue);
                            const current = parseFloat(currentValue);
                            let result;
                            switch (operation) {
                                case '+':
                                    result = prev + current;
                                    break;
                                case '-':
                                    result = prev - current;
                                    break;
                                case '*':
                                case '×':
                                    result = prev * current;
                                    break;
                                case '/':
                                case '÷':
                                    if (current === 0) {
                                        result = 'Error';
                                    } else {
                                        result = prev / current;
                                    }
                                    break;
                            }
                            currentValue = String(result);
                            previousValue = null;
                            operation = null;
                            resetOnNextInput = true;
                        }
                    }
                    updateDisplayFontSize(displayValue, currentValue);
                });
                keypad.appendChild(button);
            });
            calculatorContainer.appendChild(keypad);
            document.addEventListener('click', function clickOutside(e) {
                if (!calculatorContainer.contains(e.target) && e.target.id !== 'calculatorButton') {
                    if (sidebar.contains(calculatorContainer)) {
                        sidebar.removeChild(calculatorContainer);
                    }
                    document.removeEventListener('click', clickOutside);
                    document.removeEventListener('keydown', handleKeyPress);
                    state.calculatorVisible = false;
                    const calculatorButton = document.getElementById('calculatorButton');
                    if (calculatorButton) {
                        calculatorButton.style.boxShadow = 'none';
                    }
                }
            }, {
                capture: true
            });
            const handleKeyPress = (e) => {
                const key = e.key;
                if ('0123456789'.includes(key)) {
                    const numberBtn = Array.from(keypad.children).find(btn => btn.textContent === key);
                    if (numberBtn) numberBtn.click();
                } else if (key === '+' || key === '-') {
                    const opBtn = Array.from(keypad.children).find(btn => btn.textContent === key);
                    if (opBtn) opBtn.click();
                } else if (key === '*') {
                    const multBtn = Array.from(keypad.children).find(btn => btn.textContent === '×');
                    if (multBtn) multBtn.click();
                } else if (key === '/') {
                    const divBtn = Array.from(keypad.children).find(btn => btn.textContent === '÷');
                    if (divBtn) divBtn.click();
                } else if (key === 'Enter' || key === '=') {
                    const equalsBtn = Array.from(keypad.children).find(btn => btn.textContent === '=');
                    if (equalsBtn) equalsBtn.click();
                } else if (key === 'Escape' || key === 'c' || key === 'C') {
                    clearButton.click();
                }
            };
            document.addEventListener('keydown', handleKeyPress);
            sidebar.appendChild(calculatorContainer);
            setTimeout(() => {
                calculatorContainer.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            }, 0);
        },
        toggleDeleteMode: () => {
            state.isDeleteMode = !state.isDeleteMode;
            state.isEditMode = false;
            const sidebar = document.getElementById('enhanced-sidebar');
            const theme = utils.getTheme();
            const deleteButton = document.getElementById('deleteButton');
            if (sidebar) sidebar.style.backgroundColor = state.isDeleteMode ? theme.DANGER : (state.isLightMode ? theme.BG : theme.BG);
            document.querySelectorAll('.draggable').forEach(element => {
                const deleteBtn = element.querySelector('button[class*="delete"]');
                if (deleteBtn) deleteBtn.style.display = state.isDeleteMode ? 'flex' : 'none';
            });
            if (deleteButton) deleteButton.style.backgroundColor = state.isDeleteMode ? theme.DANGER : '#444444';
            const editButton = document.getElementById('editButton');
            if (editButton) editButton.style.backgroundColor = '#444444';
            document.querySelectorAll('[data-resizer]').forEach(resizer => {
                resizer.style.display = 'none';
            });
            refreshSidebar();
            utils.showToast(`${state.isDeleteMode ? 'Activated' : 'Deactivated'} Delete Mode`, 'info');
        },
        toggleEditMode: () => {
            state.isEditMode = !state.isEditMode;
            state.isDeleteMode = false;
            const sidebar = document.getElementById('enhanced-sidebar');
            const theme = utils.getTheme();
            const editButton = document.getElementById('editButton');
            if (sidebar) sidebar.style.backgroundColor = state.isEditMode ? theme.SUCCESS : (state.isLightMode ? theme.BG : theme.BG);
            document.querySelectorAll('[data-resizer]').forEach(resizer => {
                resizer.style.display = state.isEditMode ? 'flex' : 'none';
            });
            document.querySelectorAll('.draggable').forEach(element => {
                element.style.cursor = state.isEditMode ? 'move' : 'default';
                const deleteBtn = element.querySelector('button[class*="delete"]');
                if (deleteBtn) deleteBtn.style.display = 'none';
            });
            if (editButton) editButton.style.backgroundColor = state.isEditMode ? theme.SUCCESS : '#444444';
            const deleteButton = document.getElementById('deleteButton');
            if (deleteButton) deleteButton.style.backgroundColor = '#444444';
            refreshSidebar();
            utils.showToast(`${state.isEditMode ? 'Activated' : 'Deactivated'} Edit Mode`, 'info');
        },
        toggleClock: () => {
            state.clockVisible = !state.clockVisible;
            const existingClock = document.getElementById('torn-city-clock');
            if (existingClock) existingClock.remove();
            if (state.clockVisible) showClock();
            utils.showToast(`Clock ${state.clockVisible ? 'Activated' : 'Deactivated'}`, 'info');
            const clockButton = document.getElementById('clockButton');
            if (clockButton) clockButton.style.boxShadow = state.clockVisible ? '0 0 15px rgba(255, 255, 255, 0.5)' : 'none';
        },
        showAddMenu: () => {
            const existingMenu = document.getElementById('addMenu');
            if (existingMenu) {
                existingMenu.remove();
                return;
            }
            const theme = utils.getTheme();
            const menu = document.createElement('div');
            menu.id = 'addMenu';
            menu.style.cssText = `position: absolute; top: 50px; right: 10px; background-color: ${theme.SECONDARY_BG}; border: 1px solid ${theme.BORDER}; border-radius: 4px; padding: 5px; z-index: 991200; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);`;
            const options = [{
                    text: 'Add Group',
                    action: actions.addGroup
                },
                {
                    text: 'Add Notepad',
                    action: actions.addNotepad
                },
                {
                    text: 'Add Attack List',
                    action: actions.addAttackList
                },
                {
                    text: 'Add Todo List',
                    action: actions.addTodoList
                },
                {
                    text: 'Add Loan Tracker',
                    action: actions.addLoanTracker
                },
                {
                    text: 'Add Auction Tracker',
                    action: actions.addAuctionTracker
                },
                {
                    text: 'Add Timer Group',
                    action: actions.addCountdownGroup
                }
            ];
            options.forEach(option => {
                const button = createAddMenuButton(option, theme);
                menu.appendChild(button);
            });
            document.querySelector('#top-bar').appendChild(menu);
            const closeMenu = (e) => {
                if (!menu.contains(e.target) && e.target.id !== 'addButton') {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            };
            setTimeout(() => {
                document.addEventListener('click', closeMenu);
            }, 0);
        },
        addGroup: async () => {
            const theme = utils.getTheme();
            const result = await dialogs.createPromptDialog('Add Group', [{
                id: 'groupName',
                label: 'Group Name',
                type: 'text'
            }], theme);
            if (result && result.groupName) {
                const position = utils.findOptimalPosition();
                const newGroup = {
                    name: result.groupName,
                    links: [],
                    position: position,
                    size: {
                        width: CONSTANTS.MIN_GROUP_WIDTH,
                        height: CONSTANTS.MIN_GROUP_HEIGHT
                    }
                };
                state.groups.unshift(newGroup);
                utils.saveState(`${CONSTANTS.STATE_KEYS.GROUPS}_${state.currentPage}`, state.groups);
                refreshSidebar();
                utils.showToast(`Group "${result.groupName}" added`, 'success');
            }
        },
        addNotepad: async () => {
            const theme = utils.getTheme();
            const result = await dialogs.createPromptDialog('Add Notepad', [{
                id: 'notepadName',
                label: 'Notepad Name',
                type: 'text'
            }], theme);
            if (result && result.notepadName) {
                const position = utils.findOptimalPosition();
                state.notepads.push({
                    name: result.notepadName,
                    content: '',
                    pages: [{
                        name: 'Page 1',
                        content: ''
                    }],
                    currentPage: 0,
                    position: position,
                    size: {
                        width: 200,
                        height: 150
                    }
                });
                utils.saveState(`${CONSTANTS.STATE_KEYS.NOTEPADS}_${state.currentPage}`, state.notepads);
                refreshSidebar();
                utils.showToast(`Notepad "${result.notepadName}" added`, 'success');
            }
        },
        addAttackList: async () => {
            const theme = utils.getTheme();
            const result = await dialogs.createPromptDialog('Add Attack List', [{
                id: 'listName',
                label: 'List Name',
                type: 'text'
            }], theme);
            if (result && result.listName) {
                const position = utils.findOptimalPosition();
                state.attackLists.push({
                    name: result.listName,
                    targets: [],
                    attackUrl: 'https://www.torn.com/loader.php?sid=attack&user2ID=',
                    position: position,
                    size: {
                        width: CONSTANTS.MIN_GROUP_WIDTH,
                        height: CONSTANTS.MIN_GROUP_HEIGHT
                    }
                });
                utils.saveState(`${CONSTANTS.STATE_KEYS.ATTACK_LISTS}_${state.currentPage}`, state.attackLists);
                refreshSidebar();
                utils.showToast(`Attack list "${result.listName}" added`, 'success');
            }
        },
        addTodoList: async () => {
            const theme = utils.getTheme();
            const result = await dialogs.createPromptDialog('Add Todo List', [{
                    id: 'listName',
                    label: 'List Name',
                    type: 'text'
                },
                {
                    id: 'resetDaily',
                    label: 'Reset Daily?',
                    type: 'checkbox'
                },
                {
                    id: 'storeCompleted',
                    label: 'Store Completed Items?',
                    type: 'checkbox'
                }
            ], theme);
            if (result && result.listName) {
                const position = utils.findOptimalPosition();
                const newTodoList = {
                    name: result.listName,
                    items: [],
                    completedItems: [],
                    resetDaily: result.resetDaily,
                    storeCompleted: result.storeCompleted,
                    position: position,
                    size: {
                        width: CONSTANTS.MIN_GROUP_WIDTH,
                        height: CONSTANTS.MIN_GROUP_HEIGHT
                    }
                };
                state.todoLists.push(newTodoList);
                utils.saveState(`${CONSTANTS.STATE_KEYS.TODO_LISTS}_${state.currentPage}`, state.todoLists);
                if (newTodoList.resetDaily) setupDailyReset(state.todoLists.length - 1);
                refreshSidebar();
                utils.showToast(`Todo list "${result.listName}" added`, 'success');
            }
        },
        addAuctionTracker: async () => {
            if (!state.auctionTracker.position) {
                state.auctionTracker.position = {
                    x: 0,
                    y: 0
                };
                state.auctionTracker.size = {
                    width: 200,
                    height: 'auto'
                };
                state.auctionTracker.active = true;
                utils.saveState(`${CONSTANTS.STATE_KEYS.AUCTION_TRACKER}_${state.currentPage}`, state.auctionTracker);
            }
            refreshSidebar();
            utils.showToast('Auction tracker added', 'success');
        },
        addAuctionEntry: async () => {
            const theme = utils.getTheme();
            const result = await dialogs.createAuctionEntryDialog(theme);
            if (result) {
                const now = Date.now();
                const endTime = now + (result.timeLeft * 60 * 1000);
                state.auctionTracker.auctions.push({
                    item: result.item,
                    seller: result.seller,
                    endTime: endTime,
                    created: now
                });
                utils.saveState(`${CONSTANTS.STATE_KEYS.AUCTION_TRACKER}_${state.currentPage}`, state.auctionTracker);
                refreshSidebar();
                if (result.timeLeft > 5) {
                    setTimeout(() => {
                        if (Notification.permission === "granted") {
                            new Notification(`Auction Ending Soon: ${result.item}`, {
                                body: `Seller: ${result.seller} - Ending in 5 minutes!`
                            });
                        }
                    }, (result.timeLeft - 5) * 60 * 1000);
                }
                utils.showToast(`Auction for "${result.item}" added`, 'success');
            }
        },
        addLoanTracker: async () => {
            if (!state.loanTracker.position) {
                state.loanTracker.position = {
                    x: 0,
                    y: 0
                };
                state.loanTracker.size = {
                    width: CONSTANTS.MIN_GROUP_WIDTH,
                    height: CONSTANTS.MIN_GROUP_HEIGHT
                };
                utils.saveState(`${CONSTANTS.STATE_KEYS.LOAN_TRACKER}_${state.currentPage}`, state.loanTracker);
            }
            refreshSidebar();
            utils.showToast('Loan tracker added', 'success');
        },
        addLoanEntry: async () => {
            const theme = utils.getTheme();
            const result = await dialogs.createLoanEntryDialog(theme);
            if (result) {
                if (!state.loanTracker.entries) state.loanTracker.entries = [];
                state.loanTracker.entries.push(result);
                utils.saveState(`${CONSTANTS.STATE_KEYS.LOAN_TRACKER}_${state.currentPage}`, state.loanTracker);
                refreshSidebar();
                utils.showToast(`Loan for ${result.user} added`, 'success');
            }
        },
        addCountdownGroup: async () => {
            const theme = utils.getTheme();
            if (state.countdownGroups.length > 0) {
                utils.showToast('Timer group already exists', 'info');
                return;
            }
            const result = await dialogs.createPromptDialog('Add Timer Group', [{
                id: 'groupName',
                label: 'Group Name',
                type: 'text'
            }], theme);
            if (result && result.groupName) {
                const position = utils.findOptimalPosition();
                const newGroup = {
                    name: result.groupName || 'Timers',
                    position: position,
                    size: {
                        width: CONSTANTS.MIN_GROUP_WIDTH,
                        height: CONSTANTS.MIN_GROUP_HEIGHT
                    },
                    timers: []
                };
                state.countdownGroups.unshift(newGroup);
                utils.saveState(`${CONSTANTS.STATE_KEYS.COUNTDOWN_GROUPS}_${state.currentPage}`, state.countdownGroups);
                refreshSidebar();
                utils.showToast('Timer group added', 'success');
            }
        },
        addManualCountdownGroup: async () => {
            const theme = utils.getTheme();
            const result = await dialogs.createManualCountdownDialog(theme);
            if (result) {
                console.log("Dialog result:", result);
                if (state.countdownGroups.length === 0) {
                    const position = utils.findOptimalPosition();
                    const newGroup = {
                        name: 'Timers',
                        position: position,
                        size: {
                            width: CONSTANTS.MIN_GROUP_WIDTH,
                            height: CONSTANTS.MIN_GROUP_HEIGHT
                        },
                        timers: []
                    };
                    state.countdownGroups.push(newGroup);
                }
                state.countdownGroups[0].timers.push({
                    name: result.name,
                    endTime: result.endTime,
                    completed: false
                });
                utils.saveState(`${CONSTANTS.STATE_KEYS.COUNTDOWN_GROUPS}_${state.currentPage}`, state.countdownGroups);
                refreshSidebar();
                utils.showToast(`Custom countdown "${result.name}" added`, 'success');
            }
        },
        addTarget: async (list) => {
            const theme = utils.getTheme();
            const result = await dialogs.createPromptDialog('Add Target', [{
                id: 'targetName',
                label: 'Target Name',
                type: 'text'
            }, {
                id: 'targetId',
                label: 'Player ID',
                type: 'text'
            }], theme);
            if (result && result.targetName && result.targetId) {
                try {
                    const targetId = parseInt(result.targetId);
                    if (isNaN(targetId)) throw new Error('Invalid Player ID');
                    list.targets.push({
                        name: result.targetName,
                        id: targetId
                    });
                    utils.saveState(`${CONSTANTS.STATE_KEYS.ATTACK_LISTS}_${state.currentPage}`, state.attackLists);
                    refreshSidebar();
                    utils.showToast(`Target "${result.targetName}" added`, 'success');
                } catch (error) {
                    alert('Please enter a valid Player ID');
                }
            }
        },
        addCurrentPageUserToList: (list) => {
            const userId = utils.getCurrentPageUserId();
            if (!userId) {
                utils.showToast('Could not find user ID on current page', 'error');
                return;
            }
            const existingTarget = list.targets.find(target => target.id === userId);
            if (existingTarget) {
                utils.showToast(`User already in attack list`, 'info');
                return;
            }
            let userName = "Target";
            try {
                if (window.location.href.includes('loader.php?sid=attack')) {
                    const userNameSpans = document.querySelectorAll('.userName___loAWK.user-name');
                    if (userNameSpans && userNameSpans.length > 0) {
                        const targetSpan = userNameSpans[1] || userNameSpans[0];
                        if (targetSpan) {
                            userName = targetSpan.textContent.trim();
                            console.log('Found username from attack page:', userName);
                        }
                    }
                } else {
                    const selectors = [
                        'div.user.name',
                        '[data-placeholder]',
                        '.profile-container .name',
                        '.user-info .name',
                        '.title-black',
                        '#skip-to-content h4'
                    ];
                    for (const selector of selectors) {
                        const element = document.querySelector(selector);
                        if (element) {
                            if (element.getAttribute('data-placeholder')) {
                                userName = element.getAttribute('data-placeholder').trim();
                                break;
                            }
                            if (element.textContent.trim()) {
                                userName = element.textContent.trim();
                                break;
                            }
                        }
                    }
                }
                if (userName === "Target" && document.title && document.title.includes('-')) {
                    const titleParts = document.title.split('-');
                    if (titleParts.length > 1) {
                        const potentialName = titleParts[0].trim();
                        if (potentialName && potentialName !== "Torn") {
                            userName = potentialName;
                        }
                    }
                }
                console.log('Final username found:', userName);
            } catch (e) {
                console.error('Error getting username:', e);
            }
            list.targets.push({
                name: userName,
                id: userId
            });
            utils.saveState(`${CONSTANTS.STATE_KEYS.ATTACK_LISTS}_${state.currentPage}`, state.attackLists);
            refreshSidebar();
            utils.showToast(`Added ${userName} to attack list`, 'success');
        },
        addTodoItem: async (listIndex) => {
            const theme = utils.getTheme();
            const dialogId = 'todoItem' + Date.now();
            const overlay = dom.createOverlay(theme);
            const dialog = dom.createDialogContainer('Add Todo Item', theme);
            dialog.innerHTML += `<form id="todoItemForm_${dialogId}">
    <div style="margin-bottom: 10px;">
    <label style="color: ${theme.TEXT}; display: block; margin-bottom: 5px;">Task Name:</label>
    <input type="text" id="itemName_${dialogId}" style="width: 100%; padding: 5px; background: ${theme.BG}; border: 1px solid ${theme.BORDER}; color: ${theme.TEXT}; border-radius: 3px;">
    </div>
    <div style="margin-bottom: 10px;">
    <label style="color: ${theme.TEXT}; display: block; margin-bottom: 5px;">Link (Optional):</label>
    <input type="text" id="itemUrl_${dialogId}" style="width: 100%; padding: 5px; background: ${theme.BG}; border: 1px solid ${theme.BORDER}; color: ${theme.TEXT}; border-radius: 3px;">
    </div>
    <div style="margin-bottom: 10px;">
    <label style="color: ${theme.TEXT}; display: block; margin-bottom: 5px;">Emoji:</label>
    <input type="text" id="itemEmoji_${dialogId}" style="width: 100%; padding: 5px; background: ${theme.BG}; border: 1px solid ${theme.BORDER}; color: ${theme.TEXT}; border-radius: 3px; margin-bottom: 5px;" placeholder="✅">
${dom.createEmojiButtons(theme)}
</div>
${dom.createDialogButtons(theme)}
</form>`;

            function cleanup() {
                document.body.removeChild(overlay);
            }
            return new Promise((resolve) => {
                const form = dialog.querySelector(`#todoItemForm_${dialogId}`);
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const itemName = document.getElementById(`itemName_${dialogId}`).value.trim();
                    const itemUrl = document.getElementById(`itemUrl_${dialogId}`).value.trim();
                    const itemEmoji = document.getElementById(`itemEmoji_${dialogId}`).value.trim() || '✅';
                    if (!itemName) {
                        alert('Please enter a task name');
                        return;
                    }
                    cleanup();
                    resolve({
                        name: itemName,
                        url: itemUrl,
                        emoji: itemEmoji
                    });
                });
                dialog.querySelector('.cancelBtn').addEventListener('click', () => {
                    cleanup();
                    resolve(null);
                });
                overlay.appendChild(dialog);
                document.body.appendChild(overlay);
                document.getElementById(`itemName_${dialogId}`).focus();
                const handleEscape = (e) => {
                    if (e.key === 'Escape') {
                        cleanup();
                        resolve(null);
                        document.removeEventListener('keydown', handleEscape);
                    }
                };
                document.addEventListener('keydown', handleEscape);
            }).then(result => {
                if (result) {
                    const list = state.todoLists[listIndex];
                    list.items.push({
                        name: result.name,
                        url: result.url || '',
                        emoji: result.emoji,
                        checked: false
                    });
                    utils.saveState(`${CONSTANTS.STATE_KEYS.TODO_LISTS}_${state.currentPage}`, state.todoLists);
                    refreshSidebar();
                    utils.showToast(`Todo item "${result.name}" added`, 'success');
                }
            });
        }
    };
    let isTypingOrFocused = false;
    document.addEventListener('focusin', (e) => {
        const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.contentEditable === 'true';
        if (isInput) isTypingOrFocused = true;
    });
    document.addEventListener('focusout', (e) => {
        const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.contentEditable === 'true';
        if (isInput) isTypingOrFocused = false;
    });
    document.addEventListener('keydown', (e) => {
        const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.contentEditable === 'true';
        if (isInput) isTypingOrFocused = true;
    });
    document.addEventListener('keyup', (e) => {
        const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.contentEditable === 'true';
        if (isInput && !document.activeElement.matches('input, textarea, [contenteditable]')) isTypingOrFocused = false;
    });

    function addSidebarResizer() {
        const sidebar = document.getElementById('enhanced-sidebar');
        if (!sidebar || document.getElementById('sidebar-width-resizer')) return;

        const resizer = document.createElement('div');
        resizer.id = 'sidebar-width-resizer';
        resizer.style.cssText = `position: absolute; top: 0; width: 8px; height: 100%; cursor: ew-resize; z-index: 991001; background: transparent;`;
        updateResizerPosition(resizer);

        let startX, startWidth;

        resizer.addEventListener('mousedown', (e) => {
            if (state.isAutoWidth || window.innerWidth < 768) return;

            startX = e.clientX;
            startWidth = parseInt(window.getComputedStyle(sidebar).width, 10);
            document.body.style.userSelect = 'none';

            function onMouseMove(ev) {
                const dx = ev.clientX - startX;
                let newWidth = state.isSidebarRight ? Math.max(180, startWidth - dx) : Math.max(180, startWidth + dx);
                newWidth = Math.min(newWidth, window.innerWidth - 40);
                sidebar.style.width = newWidth + 'px';
            }

            function onMouseUp(ev) {
                const dx = ev.clientX - startX;
                let newWidth = state.isSidebarRight ? Math.max(180, startWidth - dx) : Math.max(180, startWidth + dx);
                newWidth = Math.min(newWidth, window.innerWidth - 40);
                localStorage.setItem('sidebarWidth', newWidth);

                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                document.body.style.userSelect = '';
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        sidebar.appendChild(resizer);
    }

    function updateResizerPosition(resizer) {
        if (state.isSidebarRight) {
            resizer.style.left = '0';
            resizer.style.right = 'auto';
            resizer.style.cursor = 'w-resize';
        } else {
            resizer.style.left = 'auto';
            resizer.style.right = '0';
            resizer.style.cursor = 'e-resize';
        }
    }

    function updateSidebarResizerPosition() {
        const resizer = document.getElementById('sidebar-width-resizer');
        if (resizer) updateResizerPosition(resizer);
    }

    function refreshSidebar() {
        if (state.isGlobalResizing) return;
        if (state.isDragging || isTypingOrFocused) return;
        const groupContainer = document.getElementById('group-container');
        if (!groupContainer) return;

        try {
            utils.applySidebarWidth();
            addSidebarResizer();
            updateSidebarResizerPosition();

            const scrollPosition = groupContainer.scrollTop;
            groupContainer.innerHTML = '';

            try {
                const reversedGroups = [...state.groups].reverse();
                reversedGroups.forEach((group, idx) => {
                    const originalIndex = state.groups.length - 1 - idx;
                    const groupDiv = createGroupElement(group, originalIndex);
                    groupContainer.appendChild(groupDiv);
                });

                if (state.countdownGroups.length > 0) {
                    state.countdownGroups.forEach((group, index) => {
                        const countdownDiv = createCountdownElement(group, index);
                        groupContainer.appendChild(countdownDiv);
                    });
                }

                state.notepads.forEach((notepad, index) => {
                    const notepadDiv = createNotepadElement(notepad, index);
                    groupContainer.appendChild(notepadDiv);
                });

                state.attackLists.forEach((list, index) => {
                    const attackListDiv = createAttackListElement(list, index);
                    groupContainer.appendChild(attackListDiv);
                });

                state.todoLists.forEach((list, index) => {
                    const todoListDiv = createTodoListElement(list, index);
                    groupContainer.appendChild(todoListDiv);
                });

                const loanTrackerState = localStorage.getItem(`${CONSTANTS.STATE_KEYS.LOAN_TRACKER}_${state.currentPage}`);
                if (loanTrackerState && loanTrackerState !== "null" && JSON.parse(loanTrackerState) !== null) {
                    const loanTrackerDiv = createLoanTrackerElement();
                    groupContainer.appendChild(loanTrackerDiv);
                }

                const auctionTrackerState = localStorage.getItem(`${CONSTANTS.STATE_KEYS.AUCTION_TRACKER}_${state.currentPage}`);
                if (auctionTrackerState && auctionTrackerState !== "null" && JSON.parse(auctionTrackerState) !== null) {
                    const auctionTrackerDiv = createAuctionTrackerElement();
                    groupContainer.appendChild(auctionTrackerDiv);
                }

                groupContainer.scrollTop = scrollPosition;
                applyModeSpecificStyling();

            } catch (error) {
                console.error('Error rendering elements:', error);
                const theme = utils.getTheme();
                const errorMessage = document.createElement('div');
                errorMessage.style.cssText = `padding: 15px; margin: 20px; background-color: ${state.isLightMode ? '#ffeeee' : '#552222'}; border: 1px solid ${state.isLightMode ? '#ffcccc' : '#993333'}; color: ${state.isLightMode ? '#cc3333' : '#ffcccc'}; border-radius: 5px; text-align: center;`;
                errorMessage.innerHTML = `<div style="font-weight: bold; margin-bottom: 8px;">Error Refreshing Sidebar</div><div>${error.message}</div><div style="margin-top: 10px; font-size: 14px;">Try reloading the page or checking for script updates.</div>`;
                groupContainer.appendChild(errorMessage);
            }
        } catch (error) {
            console.error('Critical error in refreshSidebar:', error);
        }
    }

    function applyModeSpecificStyling() {
        if (state.isDeleteMode) {
            document.querySelectorAll('.draggable').forEach(element => {
                const deleteBtn = element.querySelector('button[class*="delete"]');
                if (deleteBtn) deleteBtn.style.display = 'flex';
            });
        } else if (state.isEditMode) {
            document.querySelectorAll('[data-resizer]').forEach(resizer => {
                resizer.style.display = 'flex';
            });
            document.querySelectorAll('.draggable').forEach(element => {
                element.style.cursor = 'move';
            });
        }
    }

    function checkTodoListResets() {
        state.todoLists.forEach((list) => {
            if (list.resetDaily) {
                const now = new Date();
                const utcHour = now.getUTCHours();
                const utcMinute = now.getUTCMinutes();
                if (utcHour === 0 && utcMinute === 0) {
                    list.items = list.items.map(item => ({
                        ...item,
                        checked: false
                    }));
                    utils.saveState(`${CONSTANTS.STATE_KEYS.TODO_LISTS}_${state.currentPage}`, state.todoLists);
                    refreshSidebar();
                }
            }
        });
    }

    function setupDragListeners(container) {
        container.removeEventListener('mousedown', handleDragStart);
        container.removeEventListener('touchstart', handleTouchStart);
        container.addEventListener('mousedown', handleDragStart);
        container.addEventListener('touchstart', handleTouchStart, {
            passive: false
        });

        function handleTouchStart(touchEvent) {
            touchEvent.preventDefault();
            const touch = touchEvent.touches[0];
            handleStart(touch, true);
        }

        function handleDragStart(mouseEvent) {
            handleStart(mouseEvent, false);
        }

        function handleStart(event, isTouch) {
            if (!state.isEditMode) return;
            const target = event.target;
            if (target.classList.contains('no-drag') ||
                target.closest('.no-drag') ||
                target.hasAttribute('data-resizer') ||
                target.closest('[data-resizer]')) {
                return;
            }
            const draggable = target.closest('.draggable');
            if (!draggable) return;
            state.isDragging = true;
            state.dragTarget = draggable;
            const allDraggable = document.querySelectorAll('.draggable');
            let maxZ = 1;
            allDraggable.forEach(el => {
                const zIndex = parseInt(el.style.zIndex || '1');
                maxZ = Math.max(maxZ, zIndex);
            });
            draggable.style.zIndex = `${maxZ + 1}`;
            const startX = isTouch ? event.clientX : event.clientX;
            const startY = isTouch ? event.clientY : event.clientY;
            const startLeft = parseInt(draggable.style.left) || 0;
            const startTop = parseInt(draggable.style.top) || 0;
            const sidebar = document.getElementById('enhanced-sidebar');
            const maxLeft = sidebar.offsetWidth - draggable.offsetWidth;
            const maxTop = sidebar.offsetHeight - draggable.offsetHeight;
            draggable.style.transition = 'none';
            draggable.classList.add('dragging');
            let lastUpdateTime = 0;
            const throttleMs = 10;
            const MAGNET_THRESHOLD = 20;
            const SNAP_THRESHOLD = 10;

            function handleMove(moveEvent) {
                moveEvent.preventDefault();
                const currentTime = Date.now();
                if (currentTime - lastUpdateTime < throttleMs) {
                    return;
                }
                lastUpdateTime = currentTime;
                const clientX = isTouch ? moveEvent.touches[0].clientX : moveEvent.clientX;
                const clientY = isTouch ? moveEvent.touches[0].clientY : moveEvent.clientY;
                const dx = clientX - startX;
                const dy = clientY - startY;
                let newLeft = startLeft + dx;
                let newTop = startTop + dy;
                const currentRect = {
                    left: newLeft,
                    top: newTop,
                    right: newLeft + draggable.offsetWidth,
                    bottom: newTop + draggable.offsetHeight
                };
                const otherElements = Array.from(document.querySelectorAll('.draggable')).filter(el => el !== draggable);
                let bestHorizontalSnap = {
                    distance: MAGNET_THRESHOLD,
                    position: null
                };
                let bestVerticalSnap = {
                    distance: MAGNET_THRESHOLD,
                    position: null
                };
                otherElements.forEach(element => {
                    const elementPos = {
                        left: parseInt(element.style.left) || 0,
                        top: parseInt(element.style.top) || 0,
                        right: (parseInt(element.style.left) || 0) + element.offsetWidth,
                        bottom: (parseInt(element.style.top) || 0) + element.offsetHeight
                    };
                    const leftToRightDist = Math.abs(currentRect.left - elementPos.right);
                    if (leftToRightDist < bestHorizontalSnap.distance) {
                        bestHorizontalSnap = {
                            distance: leftToRightDist,
                            position: elementPos.right,
                            type: 'left'
                        };
                    }
                    const rightToLeftDist = Math.abs(currentRect.right - elementPos.left);
                    if (rightToLeftDist < bestHorizontalSnap.distance) {
                        bestHorizontalSnap = {
                            distance: rightToLeftDist,
                            position: elementPos.left - draggable.offsetWidth,
                            type: 'right'
                        };
                    }
                    const topToBottomDist = Math.abs(currentRect.top - elementPos.bottom);
                    if (topToBottomDist < bestVerticalSnap.distance) {
                        bestVerticalSnap = {
                            distance: topToBottomDist,
                            position: elementPos.bottom,
                            type: 'top'
                        };
                    }
                    const bottomToTopDist = Math.abs(currentRect.bottom - elementPos.top);
                    if (bottomToTopDist < bestVerticalSnap.distance) {
                        bestVerticalSnap = {
                            distance: bottomToTopDist,
                            position: elementPos.top - draggable.offsetHeight,
                            type: 'bottom'
                        };
                    }
                    const leftAlignDist = Math.abs(currentRect.left - elementPos.left);
                    if (leftAlignDist < bestHorizontalSnap.distance) {
                        bestHorizontalSnap = {
                            distance: leftAlignDist,
                            position: elementPos.left,
                            type: 'align-left'
                        };
                    }
                    const rightAlignDist = Math.abs(currentRect.right - elementPos.right);
                    if (rightAlignDist < bestHorizontalSnap.distance) {
                        bestHorizontalSnap = {
                            distance: rightAlignDist,
                            position: elementPos.right - draggable.offsetWidth,
                            type: 'align-right'
                        };
                    }
                    const topAlignDist = Math.abs(currentRect.top - elementPos.top);
                    if (topAlignDist < bestVerticalSnap.distance) {
                        bestVerticalSnap = {
                            distance: topAlignDist,
                            position: elementPos.top,
                            type: 'align-top'
                        };
                    }
                    const bottomAlignDist = Math.abs(currentRect.bottom - elementPos.bottom);
                    if (bottomAlignDist < bestVerticalSnap.distance) {
                        bestVerticalSnap = {
                            distance: bottomAlignDist,
                            position: elementPos.bottom - draggable.offsetHeight,
                            type: 'align-bottom'
                        };
                    }
                });
                if (bestHorizontalSnap.position !== null && bestHorizontalSnap.distance < SNAP_THRESHOLD) {
                    newLeft = bestHorizontalSnap.position;
                    draggable.classList.add('snapped-horizontal');
                } else {
                    draggable.classList.remove('snapped-horizontal');
                }
                if (bestVerticalSnap.position !== null && bestVerticalSnap.distance < SNAP_THRESHOLD) {
                    newTop = bestVerticalSnap.position;
                    draggable.classList.add('snapped-vertical');
                } else {
                    draggable.classList.remove('snapped-vertical');
                }
                newLeft = Math.max(0, Math.min(newLeft, maxLeft));
                newTop = Math.max(0, Math.min(newTop, maxTop));
                let hasOverlap = true;
                const MAX_ITERATIONS = 5;
                let iterations = 0;
                while (hasOverlap && iterations < MAX_ITERATIONS) {
                    iterations++;
                    hasOverlap = false;
                    const currentRect = {
                        left: newLeft,
                        top: newTop,
                        right: newLeft + draggable.offsetWidth,
                        bottom: newTop + draggable.offsetHeight
                    };
                    for (const element of otherElements) {
                        const elementRect = {
                            left: parseInt(element.style.left) || 0,
                            top: parseInt(element.style.top) || 0,
                            right: (parseInt(element.style.left) || 0) + element.offsetWidth,
                            bottom: (parseInt(element.style.top) || 0) + element.offsetHeight
                        };
                        if (currentRect.left < elementRect.right &&
                            currentRect.right > elementRect.left &&
                            currentRect.top < elementRect.bottom &&
                            currentRect.bottom > elementRect.top) {
                            hasOverlap = true;
                            const overlapLeft = elementRect.right - currentRect.left;
                            const overlapRight = currentRect.right - elementRect.left;
                            const overlapTop = elementRect.bottom - currentRect.top;
                            const overlapBottom = currentRect.bottom - elementRect.top;
                            const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
                            if (minOverlap === overlapLeft) {
                                newLeft = elementRect.right;
                            } else if (minOverlap === overlapRight) {
                                newLeft = elementRect.left - draggable.offsetWidth;
                            } else if (minOverlap === overlapTop) {
                                newTop = elementRect.bottom;
                            } else if (minOverlap === overlapBottom) {
                                newTop = elementRect.top - draggable.offsetHeight;
                            }
                            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
                            newTop = Math.max(0, Math.min(newTop, maxTop));
                        }
                    }
                }
                draggable.style.left = `${newLeft}px`;
                draggable.style.top = `${newTop}px`;
            }

            function handleEnd() {
                const moveEvent = isTouch ? 'touchmove' : 'mousemove';
                const endEvent = isTouch ? 'touchend' : 'mouseup';
                document.removeEventListener(moveEvent, handleMove);
                document.removeEventListener(endEvent, handleEnd);
                const finalLeft = parseInt(draggable.style.left) || 0;
                const finalTop = parseInt(draggable.style.top) || 0;
                draggable.classList.remove('dragging', 'snapped-horizontal', 'snapped-vertical');
                const type = draggable.dataset.type;
                const index = parseInt(draggable.dataset.index);
                const position = {
                    x: finalLeft,
                    y: finalTop
                };
                try {
                    switch (type) {
                        case 'group':
                            state.groups[index].position = position;
                            utils.saveState(`${CONSTANTS.STATE_KEYS.GROUPS}_${state.currentPage}`, state.groups);
                            break;
                        case 'notepad':
                            state.notepads[index].position = position;
                            utils.saveState(`${CONSTANTS.STATE_KEYS.NOTEPADS}_${state.currentPage}`, state.notepads);
                            break;
                        case 'attackList':
                            state.attackLists[index].position = position;
                            utils.saveState(`${CONSTANTS.STATE_KEYS.ATTACK_LISTS}_${state.currentPage}`, state.attackLists);
                            break;
                        case 'todoList':
                            state.todoLists[index].position = position;
                            utils.saveState(`${CONSTANTS.STATE_KEYS.TODO_LISTS}_${state.currentPage}`, state.todoLists);
                            break;
                        case 'loanTracker':
                            state.loanTracker.position = position;
                            utils.saveState(`${CONSTANTS.STATE_KEYS.LOAN_TRACKER}_${state.currentPage}`, state.loanTracker);
                            break;
                        case 'auctionTracker':
                            state.auctionTracker.position = position;
                            utils.saveState(`${CONSTANTS.STATE_KEYS.AUCTION_TRACKER}_${state.currentPage}`, state.auctionTracker);
                            break;
                        case 'countdown':
                            state.countdownGroups[index].position = position;
                            utils.saveState(`${CONSTANTS.STATE_KEYS.COUNTDOWN_GROUPS}_${state.currentPage}`, state.countdownGroups);
                            break;
                        case 'manualCountdown':
                            state.manualCountdownGroups[index].position = position;
                            utils.saveState(`${CONSTANTS.STATE_KEYS.MANUAL_COUNTDOWN_GROUPS}_${state.currentPage}`, state.manualCountdownGroups);
                            break;
                    }
                } catch (error) {
                    console.error('Error saving position:', error);
                }
                state.isDragging = false;
                state.dragTarget = null;
                draggable.style.transition = '';
                refreshSidebar();
            }
            const moveEvent = isTouch ? 'touchmove' : 'mousemove';
            const endEvent = isTouch ? 'touchend' : 'mouseup';
            document.addEventListener(moveEvent, handleMove, {
                passive: false
            });
            document.addEventListener(endEvent, handleEnd);
        }
    }

    function addDragStyles() {
        const styleEl = document.getElementById('drag-styles') || document.createElement('style');
        styleEl.id = 'drag-styles';
        styleEl.textContent = `
    .draggable {
        position: absolute;
        transition: box-shadow 0.2s ease;
    }
    .draggable.dragging {
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    }
    .draggable.snapped-horizontal {
        border-left: 2px solid #4d90fe;
        border-right: 2px solid #4d90fe;
    }
    .draggable.snapped-vertical {
        border-top: 2px solid #4d90fe;
        border-bottom: 2px solid #4d90fe;
    }
    .draggable.snapped-horizontal.snapped-vertical {
        box-shadow: 0 0 0 2px #4d90fe;
    }
    `;
        if (!styleEl.parentNode) {
            document.head.appendChild(styleEl);
        }
    }

    function createAddMenuButton(option, theme) {
        const button = document.createElement('button');
        button.textContent = option.text;
        button.style.cssText = `display: block; width: 100%; padding: 8px; margin: 2px 0; background-color: ${theme.BG}; color: ${theme.TEXT}; border: 1px solid ${theme.BORDER}; cursor: pointer; text-align: left; border-radius: 3px; transition: background-color 0.2s ease;`;
        button.addEventListener('mouseover', () => button.style.backgroundColor = theme.SECONDARY_BG);
        button.addEventListener('mouseout', () => button.style.backgroundColor = theme.BG);
        button.addEventListener('click', () => {
            option.action();
            document.getElementById('addMenu').remove();
        });
        return button;
    }

    function createGroupElement(group, index) {
        const theme = utils.getTheme();
        const groupDiv = document.createElement('div');
        groupDiv.className = 'draggable';
        groupDiv.dataset.type = 'group';
        groupDiv.dataset.index = index;
        const primaryColor = group.color || theme.SECONDARY_BG;
        const secondaryColor = utils.getSecondaryColor(primaryColor);
        groupDiv.style.cssText = `background-color: ${primaryColor}; min-height: fit-content; padding: 10px; border: 1px solid ${theme.BORDER}; border-radius: 5px; position: absolute; width: ${group.size?.width || CONSTANTS.MIN_GROUP_WIDTH}px; height: ${group.size?.height || CONSTANTS.MIN_GROUP_HEIGHT}px; left: ${group.position?.x || 0}px; top: ${group.position?.y || 0}px; ${state.isEditMode ? 'cursor: move;' : ''}`;
        const header = createGroupHeader(group, index, theme, secondaryColor);
        const linksContainer = createLinksContainer(group, index, theme, secondaryColor);
        groupDiv.appendChild(header);
        groupDiv.appendChild(linksContainer);
        if (state.isEditMode) {
            const resizer = createMagneticResizer(groupDiv, state.isLightMode, state.isEditMode, (width, height) => {
                group.size = {
                    width,
                    height
                };
                utils.saveState(`${CONSTANTS.STATE_KEYS.GROUPS}_${state.currentPage}`, state.groups);
            });
            groupDiv.appendChild(resizer);
        }
        return groupDiv;
    }

    function createGroupHeader(group, index, theme, secondaryColor) {
        const header = document.createElement('div');
        header.style.cssText = `color: ${theme.TEXT}; font-size: 16px; padding: 5px; background-color: ${secondaryColor}; border-radius: 3px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;`;
        const nameElement = createEditableName(group, group.name, 'group', index, theme);
        header.appendChild(nameElement);
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; gap: 5px; align-items: center;';
        const addLinkButton = dom.createAddButton(theme, '', () => {
            const theme = utils.getTheme();
            dialogs.createLinkDialog(index, theme);
        });
        const img = document.createElement('img');
        img.src = chrome.runtime.getURL('assets/add_white.svg');
        img.alt = 'Add';
        img.style.cssText = `width: 12px; height: 12px; vertical-align: middle;`;
        addLinkButton.textContent = '';
        addLinkButton.appendChild(img);
        buttonContainer.appendChild(addLinkButton);
        if (state.isEditMode) {
            const colorButton = dom.createAddButton(theme, '', async () => {
                const theme = utils.getTheme();
                const result = await openColorPicker(group, index, theme);
                if (result) {
                    group.color = result.elementColor;
                    utils.saveState(`${CONSTANTS.STATE_KEYS.GROUPS}_${state.currentPage}`, state.groups);
                    refreshSidebar();
                }
            });
            const img = document.createElement('img');
            img.src = chrome.runtime.getURL('assets/color_selection.svg');
            img.alt = 'Select Color';
            img.style.cssText = `width: 18px; height: 18px; vertical-align: middle;`;
            colorButton.textContent = '';
            colorButton.appendChild(img);
            buttonContainer.appendChild(colorButton);
        }
        if (state.isDeleteMode) {
            const deleteButton = dom.createDeleteButton(theme, undefined, () => {
                const theme = utils.getTheme();
                dialogs.confirmDelete('Delete this group?', theme, () => {
                    state.groups.splice(index, 1);
                    utils.saveState(`${CONSTANTS.STATE_KEYS.GROUPS}_${state.currentPage}`, state.groups);
                    refreshSidebar();
                    utils.showToast(`Group "${group.name}" deleted`, 'info');
                });
            });
            buttonContainer.appendChild(deleteButton);
        }
        header.appendChild(buttonContainer);
        return header;
    }

    function createLinksContainer(group, index, theme, secondaryColor) {
        const container = document.createElement('div');
        container.className = 'content-container';
        container.style.cssText = `display: flex; flex-direction: column; gap: 2px;`;
        group.links?.forEach((link, linkIndex) => {
            const linkDiv = createLinkElement(link, group, index, linkIndex, theme, secondaryColor);
            container.appendChild(linkDiv);
        });
        return container;
    }

    function createLinkElement(link, group, groupIndex, linkIndex, theme, secondaryColor) {
        const linkDiv = document.createElement('div');
        linkDiv.className = 'no-drag';
        linkDiv.style.cssText = `background-color: ${secondaryColor}; color: ${state.isLightMode ? '#0066cc' : '#8cb3d9'}; border: 1px solid ${theme.BORDER}; padding: 4px 10px; cursor: pointer; border-radius: 3px; display: flex; justify-content: space-between; align-items: center; min-width: 120px;`;
        const linkText = document.createElement('span');
        linkText.textContent = `${link.emoji || '🔗'} ${link.name}`;
        linkDiv.appendChild(linkText);
        const buttonWrapper = document.createElement('div');
        buttonWrapper.style.cssText = 'display: flex; gap: 5px; align-items: center;';
        if (state.isEditMode) {
            const moveButtons = createLinkMoveButtons(groupIndex, linkIndex, group.links.length, theme);
            buttonWrapper.appendChild(moveButtons);
        }
        if (state.isDeleteMode) {
            const deleteButton = dom.createDeleteButton(theme, undefined, () => {
                const theme = utils.getTheme();
                dialogs.confirmDelete('Delete this link?', theme, () => {
                    group.links.splice(linkIndex, 1);
                    utils.saveState(`${CONSTANTS.STATE_KEYS.GROUPS}_${state.currentPage}`, state.groups);
                    refreshSidebar();
                    utils.showToast(`Link "${link.name}" deleted`, 'info');
                });
            });
            buttonWrapper.appendChild(deleteButton);
        }
        linkDiv.appendChild(buttonWrapper);
        linkDiv.addEventListener('click', () => {
            window.location.href = link.url;
        });
        return linkDiv;
    }

    function createLinkMoveButtons(groupIndex, linkIndex, totalLinks, theme) {
        const container = document.createElement('div');
        container.style.cssText = `display: flex; gap: 3px; margin-left: 5px;`;
        if (linkIndex > 0) {
            container.appendChild(createMoveButton('↑', () => {
                moveLink(groupIndex, linkIndex, linkIndex - 1);
            }, theme));
        }
        if (linkIndex < totalLinks - 1) {
            container.appendChild(createMoveButton('↓', () => {
                moveLink(groupIndex, linkIndex, linkIndex + 1);
            }, theme));
        }
        return container;
    }

    function createMoveButton(text, action, theme) {
        const button = document.createElement('button');
        button.innerHTML = text;
        button.className = 'no-drag';
        button.style.cssText = `background: none; border: none; color: ${theme.TEXT}; cursor: pointer; padding: 0 2px; font-size: 12px; font-weight: bold; transition: transform 0.2s;`;
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            action();
        });
        button.addEventListener('mouseover', () => {
            button.style.transform = 'scale(1.2)';
        });
        button.addEventListener('mouseout', () => {
            button.style.transform = 'scale(1)';
        });
        return button;
    }

    function moveLink(groupIndex, fromIndex, toIndex) {
        const links = state.groups[groupIndex].links;
        const [movedLink] = links.splice(fromIndex, 1);
        links.splice(toIndex, 0, movedLink);
        utils.saveState(`${CONSTANTS.STATE_KEYS.GROUPS}_${state.currentPage}`, state.groups);
        refreshSidebar();
    }

    function createNotepadElement(notepad, index) {
        const theme = utils.getTheme();
        const notepadDiv = document.createElement('div');
        notepadDiv.className = 'draggable';
        notepadDiv.dataset.type = 'notepad';
        notepadDiv.dataset.index = index;
        const primaryColor = notepad.color || (state.isLightMode ? '#e6eded' : '#1a2a29');
        const secondaryColor = utils.getSecondaryColor(primaryColor);
        notepadDiv.style.cssText = `background-color: ${primaryColor}; min-height: fit-content; border: 1px solid ${secondaryColor}; padding: 10px; border-radius: 5px; position: absolute; width: ${notepad.size?.width || 200}px; height: ${notepad.size?.height || CONSTANTS.MIN_GROUP_HEIGHT}px; left: ${notepad.position?.x || 0}px; top: ${notepad.position?.y || 0}px; ${state.isEditMode ? 'cursor: move;' : ''}`;
        const header = document.createElement('div');
        header.style.cssText = `color: ${theme.TEXT}; font-size: 16px; padding: 5px; background-color: ${secondaryColor}; border-radius: 3px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;`;
        const leftSection = document.createElement('div');
        leftSection.style.cssText = `display: flex; align-items: center; gap: 10px; width: 100%;`;
        if (!notepad.pages) {
            notepad.pages = [{
                name: 'Page 1',
                content: notepad.content || ''
            }];
            notepad.currentPage = 0;
        }
        const pageSelect = document.createElement('select');
        pageSelect.className = 'no-drag';
        pageSelect.style.cssText = `background-color: ${primaryColor}; min-height: fit-content; color: ${theme.TEXT}; border: 1px solid ${theme.BORDER}; border-radius: 3px; padding: 4px 8px; font-size: 12px; cursor: pointer; appearance: none; -webkit-appearance: none; padding-right: 24px; width: calc(100% - 30px); background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/svg/2000" viewBox="0 0 24 24" fill="${encodeURIComponent(theme.TEXT)}"><path d="M7 10l5 5 5-5z"/></svg>'); background-repeat: no-repeat; background-position: right 4px center; background-size: 16px; transition: all 0.2s ease;`;
        const selectContainer = document.createElement('div');
        selectContainer.style.cssText = `display: flex; align-items: center; gap: 5px; width: 100%;`;
        const editPageNameBtn = document.createElement('button');
        editPageNameBtn.className = 'no-drag';
        editPageNameBtn.style.cssText = `
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    display: ${state.isEditMode ? 'flex' : 'none'};
    align-items: center;
    opacity: 0.6;
    transition: opacity 0.2s;
    `;
        const penIcon = document.createElement('img');
        penIcon.src = chrome.runtime.getURL('assets/pen.svg');
        penIcon.alt = 'Edit';
        penIcon.style.cssText = 'width: 14px; height: 14px;';
        editPageNameBtn.appendChild(penIcon);
        editPageNameBtn.addEventListener('mouseover', () => editPageNameBtn.style.opacity = '1');
        editPageNameBtn.addEventListener('mouseout', () => editPageNameBtn.style.opacity = '0.6');
        editPageNameBtn.addEventListener('click', async () => {
            const currentPageIndex = pageSelect.selectedIndex;
            const theme = utils.getTheme();
            const result = await dialogs.createPromptDialog('Edit Page Name', [{
                id: 'pageName',
                label: 'Page Name',
                type: 'text',
                value: notepad.pages[currentPageIndex].name
            }], theme);
            if (result && result.pageName.trim()) {
                notepad.pages[currentPageIndex].name = result.pageName.trim();
                utils.saveState(`${CONSTANTS.STATE_KEYS.NOTEPADS}_${state.currentPage}`, state.notepads);
                refreshSidebar();
            }
        });
        notepad.pages.forEach((page, i) => {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = page.name;
            option.selected = i === notepad.currentPage;
            pageSelect.appendChild(option);
        });
        pageSelect.addEventListener('change', (e) => {
            const selectedIndex = parseInt(e.target.value);
            notepad.currentPage = selectedIndex;
            utils.saveState(`${CONSTANTS.STATE_KEYS.NOTEPADS}_${state.currentPage}`, state.notepads);
            if (typeof refreshSidebar === 'function') refreshSidebar();
            const textarea = notepadDiv.querySelector('textarea');
            if (textarea) textarea.value = notepad.pages[selectedIndex].content || '';
        });
        pageSelect.addEventListener('mouseover', () => {
            pageSelect.style.backgroundColor = utils.getSecondaryColor(primaryColor);
        });
        pageSelect.addEventListener('mouseout', () => {
            pageSelect.style.backgroundColor = primaryColor;
        });
        pageSelect.addEventListener('focus', () => {
            isTypingOrFocused = true;
            pageSelect.style.boxShadow = `0 0 0 2px ${theme.BORDER}`;
        });
        pageSelect.addEventListener('blur', () => {
            isTypingOrFocused = false;
            pageSelect.style.boxShadow = 'none';
        });
        selectContainer.appendChild(pageSelect);
        selectContainer.appendChild(editPageNameBtn);
        const nameWrapper = createEditableName(notepad, notepad.name, 'notepad', index, theme);
        header.appendChild(nameWrapper);
        leftSection.appendChild(selectContainer);
        header.appendChild(leftSection);
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; gap: 5px; align-items: center;';
        const addPageButton = dom.createAddButton(theme, '', async () => {
            const theme = utils.getTheme();
            const result = await dialogs.createPromptDialog('Add Note Page', [{
                id: 'pageName',
                label: 'Page Name',
                type: 'text'
            }], theme);
            if (result && result.pageName) {
                notepad.pages.push({
                    name: result.pageName,
                    content: ''
                });
                notepad.currentPage = notepad.pages.length - 1;
                utils.saveState(`${CONSTANTS.STATE_KEYS.NOTEPADS}_${state.currentPage}`, state.notepads);
                refreshSidebar();
                utils.showToast(`Note page "${result.pageName}" added`, 'success');
            }
        });
        const img = document.createElement('img');
        img.src = chrome.runtime.getURL('assets/add_white.svg');
        img.alt = 'Add Page';
        img.style.cssText = 'width:12px;height:12px;vertical-align:middle;';
        addPageButton.textContent = '';
        addPageButton.appendChild(img);
        addPageButton.title = 'Add Page';
        buttonContainer.appendChild(addPageButton);
        if (state.isEditMode) {
            const colorButton = dom.createAddButton(theme, '', async () => {
                const theme = utils.getTheme();
                const result = await openColorPicker(notepad, index, theme);
                if (result) {
                    notepad.color = result.elementColor;
                    utils.saveState(`${CONSTANTS.STATE_KEYS.NOTEPADS}_${state.currentPage}`, state.notepads);
                    refreshSidebar();
                }
            });
            const colorImg = document.createElement('img');
            colorImg.src = chrome.runtime.getURL('assets/color_selection.svg');
            colorImg.alt = 'Select Color';
            colorImg.style.cssText = 'width:18px;height:18px;vertical-align:middle;';
            colorButton.textContent = '';
            colorButton.appendChild(colorImg);
            buttonContainer.appendChild(colorButton);
        }
        if (state.isDeleteMode) {
            const deleteButton = dom.createDeleteButton(theme, undefined, () => {
                const theme = utils.getTheme();
                dialogs.confirmDelete('Delete this notepad?', theme, () => {
                    state.notepads.splice(index, 1);
                    utils.saveState(`${CONSTANTS.STATE_KEYS.NOTEPADS}_${state.currentPage}`, state.notepads);
                    refreshSidebar();
                    utils.showToast(`Notepad "${notepad.name}" deleted`, 'info');
                });
            });
            buttonContainer.appendChild(deleteButton);
        }
        header.appendChild(buttonContainer);
        notepadDiv.appendChild(header);
        const textarea = document.createElement('textarea');
        textarea.className = 'no-drag content-container';
        textarea.value = notepad.pages[notepad.currentPage].content || '';
        requestAnimationFrame(() => {
            const headerHeight = header.offsetHeight;
            const padding = 20;
            const bgColor = primaryColor;
            const textColor = utils.getContrastingTextColor(bgColor);
            textarea.style.cssText = `
        width: 100%;
        height: calc(100% - ${headerHeight + padding}px);
        background-color: ${primaryColor};
        color: ${textColor};
        border: 1px solid ${secondaryColor};
        resize: none;
        padding: 5px;
        display: block;
        font-family: monospace;
        box-sizing: border-box;
    ${state.isEditMode || state.isDeleteMode ? 'pointer-events: none;' : ''}
    `;
        });
        textarea.addEventListener('focus', () => {
            if (!state.isEditMode && !state.isDeleteMode) {
                isTypingOrFocused = true;
            }
        });
        textarea.addEventListener('blur', () => {
            if (!state.isEditMode && !state.isDeleteMode) {
                isTypingOrFocused = false;
            }
        });
        textarea.addEventListener('input', (e) => {
            if (!state.isEditMode && !state.isDeleteMode) {
                notepad.pages[notepad.currentPage].content = e.target.value;
                utils.saveState(`${CONSTANTS.STATE_KEYS.NOTEPADS}_${state.currentPage}`, state.notepads);
            }
        });
        if (state.isEditMode) {
            textarea.style.cursor = 'move';
        }
        notepadDiv.appendChild(textarea);
        if (state.isEditMode) {
            const resizer = createMagneticResizer(notepadDiv, state.isLightMode, state.isEditMode, (width, height) => {
                notepad.size = {
                    width,
                    height
                };
                utils.saveState(`${CONSTANTS.STATE_KEYS.NOTEPADS}_${state.currentPage}`, state.notepads);
            });
            notepadDiv.appendChild(resizer);
        }
        return notepadDiv;
    }

    function createAttackListElement(list, index) {
        const theme = utils.getTheme();
        const attackListDiv = document.createElement('div');
        attackListDiv.className = 'draggable';
        attackListDiv.dataset.type = 'attackList';
        attackListDiv.dataset.index = index;
        const primaryColor = list.color || (state.isLightMode ? '#f7e6e6' : '#331f1f');
        const secondaryColor = utils.getSecondaryColor(primaryColor);
        attackListDiv.style.cssText = `background-color: ${primaryColor}; min-height: fit-content; padding: 10px; border: 1px solid ${secondaryColor}; border-radius: 5px; position: absolute; width: ${list.size?.width || 200}px; height: ${list.size?.height || CONSTANTS.MIN_GROUP_HEIGHT}px; left: ${list.position?.x || 0}px; top: ${list.position?.y || 0}px; ${state.isEditMode ? 'cursor: move;' : ''}`;
        const header = createAttackListHeader(list, index, theme, secondaryColor);
        attackListDiv.appendChild(header);
        const targetsContainer = createTargetsContainer(list, index, theme, secondaryColor);
        attackListDiv.appendChild(targetsContainer);
        if (state.isEditMode) {
            const resizer = createMagneticResizer(attackListDiv, state.isLightMode, state.isEditMode, (width, height) => {
                list.size = {
                    width,
                    height
                };
                utils.saveState(`${CONSTANTS.STATE_KEYS.ATTACK_LISTS}_${state.currentPage}`, state.attackLists);
            });
            attackListDiv.appendChild(resizer);
        }
        return attackListDiv;
    }

    function createAttackListHeader(list, index, theme, secondaryColor) {
        const header = document.createElement('div');
        header.style.cssText = `color: ${theme.TEXT}; font-size: 16px; padding: 5px; background-color: ${secondaryColor}; border-radius: 3px; display: flex; justify-content: space-between; align-items: center;`;
        const nameElement = createEditableName(list, list.name, 'attackList', index, theme);
        header.appendChild(nameElement);
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; gap: 5px; align-items: center;';
        if (state.isEditMode) {
            const colorButton = dom.createAddButton(theme, '', async () => {
                const theme = utils.getTheme();
                const result = await openColorPicker(list, index, theme);
                if (result) {
                    list.color = result.elementColor;
                    utils.saveState(`${CONSTANTS.STATE_KEYS.ATTACK_LISTS}_${state.currentPage}`, state.attackLists);
                    refreshSidebar();
                }
            });
            const img = document.createElement('img');
            img.src = chrome.runtime.getURL('assets/color_selection.svg');
            img.alt = 'Select Color';
            img.style.cssText = 'width: 12px; height: 12px; vertical-align: middle;';
            colorButton.textContent = '';
            colorButton.appendChild(img);
            colorButton.title = 'Change list color';
            buttonContainer.appendChild(colorButton);
        }
        const addTargetButton = dom.createAddButton(theme, '', () => actions.addTarget(list));
        const imgAddTarget = document.createElement('img');
        imgAddTarget.src = chrome.runtime.getURL('assets/add_white.svg');
        imgAddTarget.alt = 'Add';
        imgAddTarget.style.cssText = 'width: 12px; height: 12px; vertical-align: middle;';
        addTargetButton.textContent = '';
        addTargetButton.appendChild(imgAddTarget);
        buttonContainer.appendChild(addTargetButton);
        const addCurrentUserButton = document.createElement('button');
        const imgCurrentUser = document.createElement('img');
        imgCurrentUser.src = chrome.runtime.getURL('assets/pin.svg');
        imgCurrentUser.alt = 'Add';
        imgCurrentUser.style.cssText = 'width: 12px; height: 12px; vertical-align: middle;';
        addCurrentUserButton.textContent = '';
        addCurrentUserButton.appendChild(imgCurrentUser);
        addCurrentUserButton.title = 'Add Current Page Target (MUST BE ON USERS PROFILE)';
        addCurrentUserButton.className = 'no-drag';
        addCurrentUserButton.style.cssText = `background-color: ${theme.adddCurrentBG}; color: white; border: none; padding: 3px 7px; cursor: pointer; border-radius: 3px; font-size: 14px;`;
        addCurrentUserButton.addEventListener('click', () => {
            actions.addCurrentPageUserToList(list);
        });
        addCurrentUserButton.addEventListener('mouseover', () => {
            addCurrentUserButton.style.backgroundColor = utils.getLighterColor(theme.BUTTON_BG);
        });
        addCurrentUserButton.addEventListener('mouseout', () => {
            addCurrentUserButton.style.backgroundColor = theme.BUTTON_BG;
        });
        buttonContainer.appendChild(addCurrentUserButton);
        if (state.isDeleteMode) {
            const deleteButton = dom.createDeleteButton(theme, undefined, () => {
                const theme = utils.getTheme();
                dialogs.confirmDelete('Delete this attack list?', theme, () => {
                    state.attackLists.splice(index, 1);
                    utils.saveState(`${CONSTANTS.STATE_KEYS.ATTACK_LISTS}_${state.currentPage}`, state.attackLists);
                    refreshSidebar();
                    utils.showToast(`Attack list "${list.name}" deleted`, 'info');
                });
            });
            buttonContainer.appendChild(deleteButton);
        }
        header.appendChild(buttonContainer);
        return header;
    }

    function createTargetsContainer(list, index, theme, secondaryColor) {
        const container = document.createElement('div');
        container.className = 'content-container';
        container.style.cssText = `display: flex; flex-direction: column; gap: 2px; margin-top: 10px;`;
        list.targets?.forEach((target, targetIndex) => {
            const targetDiv = createTargetElement(target, list, index, targetIndex, theme, secondaryColor);
            container.appendChild(targetDiv);
        });
        return container;
    }

    function createTargetElement(target, list, listIndex, targetIndex, theme, secondaryColor) {
        const targetDiv = document.createElement('div');
        targetDiv.style.cssText = `background-color: ${secondaryColor}; padding: 5px 12px; border-radius: 3px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; position: relative; min-width: 130px;`;
        targetDiv.title = 'Attack ⚔️';
        targetDiv.addEventListener('click', (e) => {
            if (!state.isDeleteMode && !e.target.closest('.delete-button')) {
                window.location.href = `${list.attackUrl}${target.id}`;
            }
        });
        const nameContainer = document.createElement('div');
        nameContainer.style.cssText = `color: ${theme.TEXT};`;
        nameContainer.textContent = target.name;
        targetDiv.appendChild(nameContainer);
        const rightContainer = document.createElement('div');
        rightContainer.style.cssText = 'display: flex; align-items: center; gap: 5px;';
        const swordIcon = document.createElement('span');
        const imgSword = document.createElement('img');
        imgSword.src = chrome.runtime.getURL('assets/attack.svg');
        imgSword.alt = 'Attack';
        imgSword.style.cssText = 'width: 12px; height: 12px; vertical-align: middle;';
        swordIcon.textContent = '';
        swordIcon.appendChild(imgSword);
        swordIcon.style.cssText = `color: ${theme.TEXT};`;
        rightContainer.appendChild(swordIcon);
        if (state.isDeleteMode) {
            const deleteButton = dom.createDeleteButton(theme, undefined, () => {
                const theme = utils.getTheme();
                dialogs.confirmDelete('Delete this target?', theme, () => {
                    list.targets.splice(targetIndex, 1);
                    utils.saveState(`${CONSTANTS.STATE_KEYS.ATTACK_LISTS}_${state.currentPage}`, state.attackLists);
                    refreshSidebar();
                    utils.showToast(`Target "${target.name}" deleted`, 'info');
                });
            });
            deleteButton.className = 'delete-button no-drag';
            rightContainer.appendChild(deleteButton);
        }
        targetDiv.appendChild(rightContainer);
        return targetDiv;
    }

    function createTodoListElement(list, index) {
        const theme = utils.getTheme();
        const todoListDiv = document.createElement('div');
        todoListDiv.className = 'draggable';
        todoListDiv.dataset.type = 'todoList';
        todoListDiv.dataset.index = index;
        const primaryColor = list.color || theme.SECONDARY_BG;
        const secondaryColor = utils.getSecondaryColor(primaryColor);
        todoListDiv.style.cssText = `background-color: ${primaryColor}; min-height: fit-content; padding: 10px; border: 1px solid ${secondaryColor}; border-radius: 5px; position: absolute; width: ${list.size?.width || 200}px; height: ${list.size?.height || CONSTANTS.MIN_GROUP_HEIGHT}px; left: ${list.position?.x || 0}px; top: ${list.position?.y || 0}px; ${state.isEditMode ? 'cursor: move;' : ''}`;
        const header = createTodoListHeader(list, index, theme, secondaryColor);
        todoListDiv.appendChild(header);
        const itemsContainer = createTodoItemsContainer(list, index, theme, secondaryColor);
        todoListDiv.appendChild(itemsContainer);
        if (state.isEditMode) {
            const resizer = createMagneticResizer(todoListDiv, state.isLightMode, state.isEditMode, (width, height) => {
                list.size = {
                    width,
                    height
                };
                utils.saveState(`${CONSTANTS.STATE_KEYS.TODO_LISTS}_${state.currentPage}`, state.todoLists);
            });
            todoListDiv.appendChild(resizer);
        }
        return todoListDiv;
    }

    function createTodoListHeader(list, index, theme, secondaryColor) {
        const header = document.createElement('div');
        header.style.cssText = `color: ${theme.TEXT}; font-size: 16px; padding: 5px; background-color: ${secondaryColor}; border-radius: 3px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;`;
        const nameElement = createEditableName(list, list.name, 'todoList', index, theme);
        header.appendChild(nameElement);
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; gap: 5px; align-items: center;';
        const addItemButton = dom.createAddButton(theme, '', () => {
            actions.addTodoItem(index);
        });
        const imgAdd = document.createElement('img');
        imgAdd.src = chrome.runtime.getURL('assets/add_white.svg');
        imgAdd.alt = 'Add';
        imgAdd.style.cssText = 'width: 12px; height: 12px; vertical-align: middle;';
        addItemButton.textContent = '';
        addItemButton.appendChild(imgAdd);
        buttonContainer.appendChild(addItemButton);
        if (state.isEditMode) {
            const colorButton = dom.createAddButton(theme, '', async () => {
                const theme = utils.getTheme();
                const result = await openColorPicker(list, index, theme);
                if (result) {
                    list.color = result.elementColor;
                    utils.saveState(`${CONSTANTS.STATE_KEYS.TODO_LISTS}_${state.currentPage}`, state.todoLists);
                    refreshSidebar();
                }
            });
            const img = document.createElement('img');
            img.src = chrome.runtime.getURL('assets/color_selection.svg');
            img.alt = 'Select Color';
            img.style.cssText = 'width:18px;height:18px;vertical-align:middle;';
            colorButton.textContent = '';
            colorButton.appendChild(img);
            buttonContainer.appendChild(colorButton);
        }
        if (state.isDeleteMode) {
            const deleteButton = dom.createDeleteButton(theme, undefined, () => {
                const theme = utils.getTheme();
                dialogs.confirmDelete('Delete this todo list?', theme, () => {
                    state.todoLists.splice(index, 1);
                    utils.saveState(`${CONSTANTS.STATE_KEYS.TODO_LISTS}_${state.currentPage}`, state.todoLists);
                    refreshSidebar();
                    utils.showToast(`Todo list "${list.name}" deleted`, 'info');
                });
            });
            buttonContainer.appendChild(deleteButton);
        }
        header.appendChild(buttonContainer);
        return header;
    }

    function createTodoItemsContainer(list, index, theme, secondaryColor) {
        const container = document.createElement('div');
        container.className = 'content-container';
        container.style.cssText = `display: flex; flex-direction: column; gap: 5px;`;
        list.items?.forEach((item, itemIndex) => {
            const itemDiv = createTodoItemElement(item, list, itemIndex, theme, secondaryColor);
            container.appendChild(itemDiv);
        });
        const completedSection = createCompletedItemsSection(list, theme, secondaryColor);
        if (completedSection) {
            container.appendChild(completedSection);
        }
        return container;
    }

    function createCompletedItemsSection(list, theme, secondaryColor) {
        if (!list.storeCompleted || list.completedItems.length === 0) return null;
        const container = document.createElement('div');
        container.style.cssText = 'margin-top: 10px;';
        const header = document.createElement('div');
        header.style.cssText = `color: ${theme.TEXT}; font-size: 14px; margin-bottom: 5px; cursor: pointer; display: flex; align-items: center;`;
        header.innerHTML = '▼ Completed Items (' + list.completedItems.length + ')';
        const content = document.createElement('div');
        content.style.cssText = 'display: none; padding: 5px; background-color: ' + secondaryColor + '; border-radius: 3px;';
        list.completedItems.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.style.cssText = 'display: flex; align-items: center; gap: 5px; padding: 5px; margin-bottom: 3px; background-color: ' + utils.adjustColor(secondaryColor, -10) + '; border-radius: 2px;';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = true;
            checkbox.style.cursor = 'pointer';
            checkbox.addEventListener('change', () => {
                if (!checkbox.checked) {
                    list.items.push({
                        ...item,
                        checked: false
                    });
                    list.completedItems.splice(index, 1);
                    utils.saveState(`${CONSTANTS.STATE_KEYS.TODO_LISTS}_${state.currentPage}`, state.todoLists);
                    refreshTodoLists();
                }
            });
            const itemText = document.createElement('span');
            itemText.textContent = `${item.emoji || '✅'} ${item.name}`;
            itemText.style.cssText = `color: ${theme.TEXT}; text-decoration: line-through; opacity: 0.7; flex-grow: 1;`;
            itemDiv.appendChild(checkbox);
            itemDiv.appendChild(itemText);
            content.appendChild(itemDiv);
        });
        header.addEventListener('click', () => {
            if (content.style.display === 'none') {
                content.style.display = 'block';
                header.innerHTML = '▲ Completed Items (' + list.completedItems.length + ')';
            } else {
                content.style.display = 'none';
                header.innerHTML = '▼ Completed Items (' + list.completedItems.length + ')';
            }
        });
        container.appendChild(header);
        container.appendChild(content);
        return container;
    }

    function refreshTodoLists() {
        const container = document.getElementById('group-container');
        if (!container) return;
        state.todoLists.forEach((list, listIndex) => {
            const existing = container.querySelector(`[data-type="todoList"][data-index="${listIndex}"]`);
            const newTodoEl = createTodoListElement(list, listIndex);
            if (existing && existing.parentNode) {
                existing.parentNode.replaceChild(newTodoEl, existing);
            }
        });
    }

    function createTodoItemElement(item, list, itemIndex, theme, secondaryColor) {
        const itemDiv = document.createElement('div');
        itemDiv.style.cssText = `display: flex; align-items: center; gap: 5px; padding: 6px 10px; background-color: ${secondaryColor}; border-radius: 3px; min-width: 125px;`;
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = item.checked;
        checkbox.style.cursor = 'pointer';
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                item.checked = true;
                itemText.style.opacity = '0.5';
                itemText.style.textDecoration = 'line-through';
                if (list.storeCompleted) {
                    list.completedItems.push({
                        ...item,
                        checked: true
                    });
                    list.items.splice(itemIndex, 1);
                } else if (!list.resetDaily) {
                    setTimeout(() => {
                        list.items.splice(itemIndex, 1);
                        utils.saveState(`${CONSTANTS.STATE_KEYS.TODO_LISTS}_${state.currentPage}`, state.todoLists);
                        refreshTodoLists();
                    }, 1000);
                }
                utils.saveState(`${CONSTANTS.STATE_KEYS.TODO_LISTS}_${state.currentPage}`, state.todoLists);
                refreshTodoLists();
            } else {
                const theme = utils.getTheme();
                dialogs.confirmDelete('Are you sure you want to uncheck this task?', theme, () => {
                    item.checked = false;
                    itemText.style.opacity = '1';
                    itemText.style.textDecoration = 'none';
                    utils.saveState(`${CONSTANTS.STATE_KEYS.TODO_LISTS}_${state.currentPage}`, state.todoLists);
                    refreshTodoLists();
                });
                checkbox.checked = true;
            }
        });
        const itemText = document.createElement('span');
        itemText.textContent = `${item.emoji || '✅'} ${item.name}`;
        itemText.style.cssText = `color: ${theme.TEXT}; flex-grow: 1; text-decoration: ${item.checked ? 'line-through' : 'none'}; opacity: ${item.checked ? '0.5' : '1'}; cursor: ${item.url ? 'pointer' : 'default'};`;
        if (item.url) {
            itemText.addEventListener('click', () => {
                window.location.href = item.url;
            });
        }
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.cssText = 'display: flex; align-items: center; gap: 5px;';
        if (state.isEditMode) {
            const moveButtons = document.createElement('div');
            moveButtons.style.cssText = 'display: flex; gap: 3px;';
            if (itemIndex > 0) {
                const upButton = createMoveButton('↑', () => {
                    const temp = list.items[itemIndex];
                    list.items[itemIndex] = list.items[itemIndex - 1];
                    list.items[itemIndex - 1] = temp;
                    utils.saveState(`${CONSTANTS.STATE_KEYS.TODO_LISTS}_${state.currentPage}`, state.todoLists);
                    refreshSidebar();
                }, theme);
                moveButtons.appendChild(upButton);
            }
            if (itemIndex < list.items.length - 1) {
                const downButton = createMoveButton('↓', () => {
                    const temp = list.items[itemIndex];
                    list.items[itemIndex] = list.items[itemIndex + 1];
                    list.items[itemIndex + 1] = temp;
                    utils.saveState(`${CONSTANTS.STATE_KEYS.TODO_LISTS}_${state.currentPage}`, state.todoLists);
                    refreshSidebar();
                }, theme);
                moveButtons.appendChild(downButton);
            }
            buttonsContainer.appendChild(moveButtons);
        }
        if (state.isDeleteMode) {
            const deleteButton = dom.createDeleteButton(theme, undefined, () => {
                const theme = utils.getTheme();
                dialogs.confirmDelete('Delete this task?', theme, () => {
                    list.items.splice(itemIndex, 1);
                    utils.saveState(`${CONSTANTS.STATE_KEYS.TODO_LISTS}_${state.currentPage}`, state.todoLists);
                    refreshSidebar();
                    utils.showToast(`Todo item "${item.name}" deleted`, 'info');
                });
            });
            buttonsContainer.appendChild(deleteButton);
        }
        itemDiv.appendChild(checkbox);
        itemDiv.appendChild(itemText);
        itemDiv.appendChild(buttonsContainer);
        return itemDiv;
    }

    function createLoanTrackerElement() {
        const theme = utils.getTheme();
        const loanTrackerDiv = document.createElement('div');
        loanTrackerDiv.className = 'draggable';
        loanTrackerDiv.dataset.type = 'loanTracker';
        const primaryColor = state.loanTracker.color || theme.SECONDARY_BG;
        const secondaryColor = utils.getSecondaryColor(primaryColor);
        loanTrackerDiv.style.cssText = `background-color: ${primaryColor}; min-height: fit-content; padding: 10px; border: 1px solid ${secondaryColor}; border-radius: 5px; position: absolute; width: ${state.loanTracker.size?.width || 200}px; height: ${state.loanTracker.size?.height || CONSTANTS.MIN_GROUP_HEIGHT}px; left: ${state.loanTracker.position?.x || 0}px; top: ${state.loanTracker.position?.y || 0}px; ${state.isEditMode ? 'cursor: move;' : ''}`;
        const header = createLoanTrackerHeader(theme, secondaryColor);
        loanTrackerDiv.appendChild(header);
        const entriesContainer = createLoanEntriesContainer(theme, secondaryColor);
        loanTrackerDiv.appendChild(entriesContainer);
        if (state.isEditMode) {
            const resizer = createMagneticResizer(loanTrackerDiv, state.isLightMode, state.isEditMode, (width, height) => {
                state.loanTracker.size = {
                    width,
                    height
                };
                utils.saveState(`${CONSTANTS.STATE_KEYS.LOAN_TRACKER}_${state.currentPage}`, state.loanTracker);
            });
            loanTrackerDiv.appendChild(resizer);
        }
        return loanTrackerDiv;
    }

    function createLoanTrackerHeader(theme, secondaryColor) {
        const header = document.createElement('div');
        header.style.cssText = `color: ${theme.TEXT}; font-size: 16px; padding: 5px; background-color: ${secondaryColor}; border-radius: 3px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;`;
        header.textContent = 'Loan Tracker';
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; gap: 5px; align-items: center;';
        const addLoanButton = dom.createAddButton(theme, '+', () => {
            actions.addLoanEntry();
        });
        const img = document.createElement('img');
        img.src = chrome.runtime.getURL('assets/add_white.svg');
        img.alt = 'Add';
        img.style.cssText = 'width: 12px; height: 12px; vertical-align: middle;';
        addLoanButton.textContent = '';
        addLoanButton.appendChild(img);
        buttonContainer.appendChild(addLoanButton);
        if (state.isEditMode) {
            const colorButton = dom.createAddButton(theme, '🎨', async () => {
                const theme = utils.getTheme();
                const result = await openColorPicker(state.loanTracker, undefined, theme);
                if (result) {
                    state.loanTracker.color = result.elementColor;
                    utils.saveState(`${CONSTANTS.STATE_KEYS.LOAN_TRACKER}_${state.currentPage}`, state.loanTracker);
                    refreshSidebar();
                }
            });
            const img = document.createElement('img');
            img.src = chrome.runtime.getURL('assets/color_selection.svg');
            img.alt = 'Select Color';
            img.style.cssText = 'width:18px;height:18px;vertical-align:middle;';
            colorButton.textContent = '';
            colorButton.appendChild(img);
            buttonContainer.appendChild(colorButton);
        }
        if (state.isDeleteMode) {
            const deleteButton = dom.createDeleteButton(theme, undefined, () => {
                const theme = utils.getTheme();
                dialogs.confirmDelete('Delete Loan Tracker?', theme, () => {
                    localStorage.removeItem(`${CONSTANTS.STATE_KEYS.LOAN_TRACKER}_${state.currentPage}`);
                    localStorage.removeItem(`${CONSTANTS.STATE_KEYS.LOAN_TRACKER}_${state.currentPage}_backup`);
                    state.loanTracker = null;
                    refreshSidebar();
                    utils.showToast('Loan Tracker deleted', 'info');
                });
            });
            buttonContainer.appendChild(deleteButton);
        }
        header.appendChild(buttonContainer);
        return header;
    }

    function createLoanEntriesContainer(theme, secondaryColor) {
        const container = document.createElement('div');
        container.className = 'content-container';
        container.style.cssText = `display: flex; flex-direction: column; gap: 5px;`;
        state.loanTracker.entries?.forEach((entry, index) => {
            const entryDiv = createLoanEntryElement(entry, index, theme, secondaryColor);
            container.appendChild(entryDiv);
        });
        return container;
    }

    function createLoanEntryElement(entry, index, theme, secondaryColor) {
        const entryDiv = document.createElement('div');
        entryDiv.style.cssText = `background-color: ${secondaryColor}; padding: 8px; border-radius: 3px; display: flex; flex-direction: column; gap: 6px; margin-bottom: 8px; border-left: 3px solid ${utils.getDueDateColor(entry, theme)}; position: relative;`;
        const headerDiv = document.createElement('div');
        headerDiv.style.cssText = `display: flex; justify-content: space-between; align-items: center;`;
        const userText = document.createElement('span');
        userText.innerHTML = `<strong> <img src="${chrome.runtime.getURL('assets/pin.svg')}" alt="Seller" style="height:12px;vertical-align:left;"> ${entry.user}</strong>`;
        userText.style.cssText = `color: ${theme.TEXT}; font-size: 14px;`;
        headerDiv.appendChild(userText);
        const amountText = document.createElement('span');
        amountText.textContent = `$${entry.amount.toLocaleString()}`;
        amountText.style.cssText = `color: ${theme.TEXT}; font-weight: bold; font-size: 14px;`;
        headerDiv.appendChild(amountText);
        entryDiv.appendChild(headerDiv);
        if (entry.dueDate) {
            const dueDiv = document.createElement('div');
            dueDiv.textContent = `📅 Due: ${utils.formatDate(entry.dueDate)}`;
            dueDiv.style.cssText = `color: ${utils.getDueDateColor(entry, theme)}; font-size: 13px; ${utils.isOverdue(entry) ? 'font-weight: bold;' : ''}`;
            entryDiv.appendChild(dueDiv);
        }
        if (entry.notes) {
            const notesDiv = document.createElement('div');
            notesDiv.textContent = `📝 ${entry.notes}`;
            notesDiv.style.cssText = `color: ${theme.TEXT}; font-size: 13px; font-style: italic;`;
            entryDiv.appendChild(notesDiv);
        }
        const paymentDiv = document.createElement('div');
        paymentDiv.style.cssText = `display: flex; justify-content: space-between; align-items: center; margin-top: 4px;`;
        let historyVisible = false;
        const historyToggle = document.createElement('button');
        historyToggle.textContent = 'History';
        historyToggle.className = 'no-drag';
        historyToggle.style.cssText = `background: none; border: 1px solid ${theme.BORDER}; color: ${theme.TEXT}; padding: 3px 7px; font-size: 12px; border-radius: 3px; cursor: pointer; margin-right: 5px; ${entry.payments && entry.payments.length > 0 ? '' : 'display: none;'}`;
        const historySection = document.createElement('div');
        historySection.style.cssText = `display: none; margin-top: 8px; padding: 5px; background-color: ${theme.SECONDARY_BG}; border-radius: 3px; font-size: 12px;`;
        if (entry.payments && entry.payments.length > 0) {
            const historyTitle = document.createElement('div');
            historyTitle.textContent = 'Payment History';
            historyTitle.style.cssText = `color: ${theme.TEXT}; font-weight: bold; margin-bottom: 5px; font-size: 13px;`;
            historySection.appendChild(historyTitle);
            entry.payments.forEach(payment => {
                const paymentLine = document.createElement('div');
                paymentLine.textContent = `${utils.formatDate(new Date(payment.date))} - $${payment.amount.toLocaleString()} paid (Remaining: $${payment.remaining.toLocaleString()})`;
                paymentLine.style.cssText = `color: ${theme.TEXT}; margin-bottom: 3px;`;
                historySection.appendChild(paymentLine);
            });
        }
        historyToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            historyVisible = !historyVisible;
            historySection.style.display = historyVisible ? 'block' : 'none';
            historyToggle.textContent = historyVisible ? 'Hide History' : 'History';
        });
        const paymentInput = createPaymentInput(entry, index, theme);
        paymentDiv.appendChild(historyToggle);
        paymentDiv.appendChild(paymentInput);
        entryDiv.appendChild(paymentDiv);
        entryDiv.appendChild(historySection);
        if (state.isDeleteMode) {
            const deleteButton = dom.createDeleteButton(theme, undefined, () => {
                const theme = utils.getTheme();
                dialogs.confirmDelete('Delete this loan entry?', theme, () => {
                    state.loanTracker.entries.splice(index, 1);
                    utils.saveState(`${CONSTANTS.STATE_KEYS.LOAN_TRACKER}_${state.currentPage}`, state.loanTracker);
                    refreshSidebar();
                    utils.showToast(`Loan for "${entry.user}" deleted`, 'info');
                });
            });
            deleteButton.style.cssText = `position: absolute; top: 8px; right: 8px;`;
            entryDiv.appendChild(deleteButton);
        }
        return entryDiv;
    }

    function createAuctionTrackerElement() {
        const theme = utils.getTheme();
        const auctionTrackerDiv = document.createElement('div');
        auctionTrackerDiv.className = 'draggable';
        auctionTrackerDiv.dataset.type = 'auctionTracker';
        const primaryColor = state.auctionTracker.color || theme.SECONDARY_BG;
        const secondaryColor = utils.getSecondaryColor(primaryColor);
        auctionTrackerDiv.style.cssText = `background-color: ${primaryColor}; min-height: fit-content; padding: 8px; border: 1px solid ${secondaryColor}; border-radius: 5px; position: absolute; width: ${state.auctionTracker.size?.width}px; height: ${state.auctionTracker.size?.height || CONSTANTS.MIN_GROUP_HEIGHT}px; left: ${state.auctionTracker.position?.x || 0}px; top: ${state.auctionTracker.position?.y || 0}px; ${state.isEditMode ? 'cursor: move;' : ''}`;
        const header = createAuctionTrackerHeader(theme, secondaryColor);
        auctionTrackerDiv.appendChild(header);
        const auctionsContainer = createAuctionsContainer(theme, secondaryColor);
        auctionTrackerDiv.appendChild(auctionsContainer);
        if (state.isEditMode) {
            const resizer = createMagneticResizer(auctionTrackerDiv, state.isLightMode, state.isEditMode, (width, height) => {
                state.auctionTracker.size = {
                    width,
                    height
                };
                utils.saveState(`${CONSTANTS.STATE_KEYS.AUCTION_TRACKER}_${state.currentPage}`, state.auctionTracker);
            });
            auctionTrackerDiv.appendChild(resizer);
        }
        return auctionTrackerDiv;
    }

    function createAuctionTrackerHeader(theme, secondaryColor) {
        const header = document.createElement('div');
        header.style.cssText = `color: ${theme.TEXT}; font-size: 14px; padding: 4px; background-color: ${secondaryColor}; border-radius: 3px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;`;
        header.textContent = 'Auction Tracker';
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; gap: 4px; align-items: center;';
        const addAuctionButton = dom.createAddButton(theme, '+', () => {
            actions.addAuctionEntry();
        });
        const img = document.createElement('img');
        img.src = chrome.runtime.getURL('assets/add_white.svg');
        img.alt = 'Add';
        img.style.cssText = 'width: 12px; height: 12px; vertical-align: middle;';
        addAuctionButton.textContent = '';
        addAuctionButton.appendChild(img);
        buttonContainer.appendChild(addAuctionButton);
        if (state.isEditMode) {
            const colorButton = dom.createAddButton(theme, '🎨', async () => {
                const theme = utils.getTheme();
                const result = await openColorPicker(state.auctionTracker, undefined, theme);
                if (result) {
                    state.auctionTracker.color = result.elementColor;
                    utils.saveState(`${CONSTANTS.STATE_KEYS.AUCTION_TRACKER}_${state.currentPage}`, state.auctionTracker);
                    refreshSidebar();
                }
            });
            const img = document.createElement('img');
            img.src = chrome.runtime.getURL('assets/color_selection.svg');
            img.alt = 'Select Color';
            img.style.cssText = 'width:18px;height:18px;vertical-align:middle;';
            colorButton.textContent = '';
            colorButton.appendChild(img);
            buttonContainer.appendChild(colorButton);
        }
        if (state.isDeleteMode) {
            const deleteButton = dom.createDeleteButton(theme, undefined, () => {
                const theme = utils.getTheme();
                dialogs.confirmDelete('Delete Auction Tracker?', theme, () => {
                    localStorage.removeItem(`${CONSTANTS.STATE_KEYS.AUCTION_TRACKER}_${state.currentPage}`);
                    localStorage.removeItem(`${CONSTANTS.STATE_KEYS.AUCTION_TRACKER}_${state.currentPage}_backup`);
                    if (window.auctionCheckIntervalId) {
                        clearInterval(window.auctionCheckIntervalId);
                    }
                    state.auctionTracker = null;
                    refreshSidebar();
                    utils.showToast('Auction Tracker deleted', 'info');
                });
            });
            buttonContainer.appendChild(deleteButton);
        }
        header.appendChild(buttonContainer);
        return header;
    }

    function createAuctionsContainer(theme, secondaryColor) {
        const container = document.createElement('div');
        container.className = 'content-container';
        container.style.cssText = `display: flex; flex-wrap: wrap; gap: 4px; width: 100%; max-height: calc(100% - 40px); overflow-y: auto;`;
        state.auctionTracker.auctions?.forEach((auction, index) => {
            container.appendChild(createAuctionElement(auction, index, theme, secondaryColor));
        });
        return container;
    }

    function createAuctionElement(auction, index, theme, secondaryColor) {
        const auctionDiv = document.createElement('div');
        auctionDiv.style.cssText = `background-color: ${secondaryColor}; padding: 4px 6px; border-radius: 3px; border-left: 3px solid ${utils.getAuctionColor(auction.endTime, theme)}; flex: 1 1 calc(50% - 4px); min-width: 150px; position: relative; margin: 0;`;
        const itemText = document.createElement('div');
        const imgItem = document.createElement('img');
        imgItem.src = chrome.runtime.getURL('assets/tag.svg');
        imgItem.alt = 'Item';
        imgItem.style.cssText = 'width:16px;height:16px;vertical-align:middle;';
        itemText.appendChild(imgItem);
        itemText.appendChild(document.createTextNode(` ${auction.item}`));
        itemText.style.cssText = `color: ${theme.TEXT}; font-size: 16px; padding-right: 20px; white-space: nowrap; margin-bottom: 2px;`;
        auctionDiv.appendChild(itemText);
        const sellerText = document.createElement('div');
        const imgSeller = document.createElement('img');
        imgSeller.src = chrome.runtime.getURL('assets/pin.svg');
        imgSeller.alt = 'Seller';
        imgSeller.style.cssText = 'width:16px;height:16px;vertical-align:middle;';
        sellerText.appendChild(imgSeller);
        sellerText.appendChild(document.createTextNode(` ${auction.seller}`));
        sellerText.style.cssText = `color: ${theme.TEXT}; font-size: 14px; white-space: nowrap; margin-bottom: 2px;`;
        auctionDiv.appendChild(sellerText);
        const timeLeftText = document.createElement('div');

        function updateTime() {
            const timeLeftFormatted = utils.formatTimeLeft(auction.endTime);
            const imgTimer = document.createElement('img');
            imgTimer.src = chrome.runtime.getURL('assets/timer.svg');
            imgTimer.alt = 'Timer';
            imgTimer.style.cssText = 'width:16px;height:16px;vertical-align:middle;';
            timeLeftText.innerHTML = '';
            timeLeftText.appendChild(imgTimer);
            timeLeftText.appendChild(document.createTextNode(` ${timeLeftFormatted}`));
            timeLeftText.style.cssText = `color: ${utils.getAuctionColor(auction.endTime, theme)}; font-weight: ${utils.isEnding(auction.endTime) ? 'bold' : 'normal'}; font-size: 14px; margin-top: 1px;`;
        }
        updateTime();
        if (utils.isEnding(auction.endTime)) {
            auctionDiv.dataset.timerId = setInterval(updateTime, 1000);
        }
        auctionDiv.appendChild(timeLeftText);
        const auctionButton = document.createElement('button');
        const imgSearch = document.createElement('img');
        imgSearch.src = chrome.runtime.getURL('assets/search.svg');
        imgSearch.alt = 'Add';
        imgSearch.style.cssText = 'width:24px;height:24px;vertical-align:middle;';
        auctionButton.textContent = '';
        auctionButton.appendChild(imgSearch);
        auctionButton.title = 'Go to auctions';
        auctionButton.className = 'no-drag';
        auctionButton.style.cssText = `position: absolute; top: 50%; right: 4px; transform: translateY(-50%); background-color: transparent; border: none; cursor: pointer; font-size: 14px; padding: 0; opacity: 0.7; transition: opacity 0.2s;`;
        auctionButton.addEventListener('mouseover', () => {
            auctionButton.style.opacity = '1';
        });
        auctionButton.addEventListener('mouseout', () => {
            auctionButton.style.opacity = '0.7';
        });
        auctionButton.addEventListener('click', (e) => {
            e.stopPropagation();
            window.location.href = 'https://www.torn.com/amarket.php';
        });
        auctionDiv.appendChild(auctionButton);
        if (state.isDeleteMode) {
            const deleteButton = dom.createDeleteButton(theme, undefined, () => {
                const theme = utils.getTheme();
                dialogs.confirmDelete('Delete this auction entry?', theme, () => {
                    if (auctionDiv.dataset.timerId) {
                        clearInterval(parseInt(auctionDiv.dataset.timerId));
                    }
                    state.auctionTracker.auctions.splice(index, 1);
                    utils.saveState(`${CONSTANTS.STATE_KEYS.AUCTION_TRACKER}_${state.currentPage}`, state.auctionTracker);
                    refreshSidebar();
                    utils.showToast(`Auction for "${auction.item}" deleted`, 'info');
                    state.auctionTracker.active = false;
                });
            });
            deleteButton.style.cssText += `position: absolute; top: 50%; right: 24px; transform: translateY(-50%); padding: 0; font-size: 12px;`;
            auctionDiv.appendChild(deleteButton);
        }
        return auctionDiv;
    }

    function createCountdownElement(group, index) {
        const theme = utils.getTheme();
        const countdownDiv = document.createElement('div');
        countdownDiv.className = 'draggable';
        countdownDiv.dataset.type = 'countdown';
        countdownDiv.dataset.index = index;
        const primaryColor = group.color || theme.SECONDARY_BG;
        const secondaryColor = utils.getSecondaryColor(primaryColor);
        countdownDiv.style.cssText = `background-color: ${primaryColor}; min-height: fit-content; padding: 10px; border: 1px solid ${secondaryColor}; border-radius: 5px; position: absolute; width: ${group.size?.width || 200}px; height: ${group.size?.height || CONSTANTS.MIN_GROUP_HEIGHT}px; left: ${group.position?.x || 0}px; top: ${group.position?.y || 0}px; ${state.isEditMode ? 'cursor: move;' : ''}`;
        const header = createCountdownHeader(group, index, theme, secondaryColor);
        countdownDiv.appendChild(header);
        const timersContainer = createTimersContainer(group, index, theme, secondaryColor);
        countdownDiv.appendChild(timersContainer);
        if (state.isEditMode) {
            const resizer = createMagneticResizer(countdownDiv, state.isLightMode, state.isEditMode, (width, height) => {
                group.size = {
                    width,
                    height
                };
                utils.saveState(`${CONSTANTS.STATE_KEYS.COUNTDOWN_GROUPS}_${state.currentPage}`, state.countdownGroups);
            });
            countdownDiv.appendChild(resizer);
        }
        return countdownDiv;
    }

    function createCountdownHeader(group, index, theme, secondaryColor) {
        const header = document.createElement('div');
        header.style.cssText = `color: ${theme.TEXT}; font-size: 16px; padding: 5px; background-color: ${secondaryColor}; border-radius: 3px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;`;
        const nameElement = createEditableName(group, group.name, 'countdown', index, theme);
        header.appendChild(nameElement);
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; gap: 5px; align-items: center;';
        if (state.isEditMode) {
            const colorButton = dom.createAddButton(theme, '🎨', async () => {
                const theme = utils.getTheme();
                const result = await openColorPicker(group, index, theme);
                if (result) {
                    group.color = result.elementColor;
                    utils.saveState(`${CONSTANTS.STATE_KEYS.COUNTDOWN_GROUPS}_${state.currentPage}`, state.countdownGroups);
                    refreshSidebar();
                }
            });
            const img = document.createElement('img');
            img.src = chrome.runtime.getURL('assets/color_selection.svg');
            img.alt = 'Select Color';
            img.style.cssText = 'width:18px;height:18px;vertical-align:middle;';
            colorButton.textContent = '';
            colorButton.appendChild(img);
            buttonContainer.appendChild(colorButton);
        }
        const addTimerButton = dom.createAddButton(theme, '', () => {
            actions.addManualCountdownGroup();
        });
        const imgAddTimer = document.createElement('img');
        imgAddTimer.src = chrome.runtime.getURL('assets/add_white.svg');
        imgAddTimer.alt = 'Add';
        imgAddTimer.style.cssText = 'width: 12px; height: 12px; vertical-align: middle;';
        addTimerButton.textContent = '';
        addTimerButton.appendChild(imgAddTimer);
        buttonContainer.appendChild(addTimerButton);
        if (state.isDeleteMode) {
            const deleteButton = dom.createDeleteButton(theme, undefined, () => {
                const theme = utils.getTheme();
                dialogs.confirmDelete('Delete this countdown group?', theme, () => {
                    state.countdownGroups.splice(index, 1);
                    utils.saveState(`${CONSTANTS.STATE_KEYS.COUNTDOWN_GROUPS}_${state.currentPage}`, state.countdownGroups);
                    refreshSidebar();
                    utils.showToast(`Countdown group "${group.name}" deleted`, 'info');
                });
            });
            buttonContainer.appendChild(deleteButton);
        }
        header.appendChild(buttonContainer);
        return header;
    }

    function createTimersContainer(group, index, theme, secondaryColor) {
        const container = document.createElement('div');
        container.className = 'content-container';
        container.style.cssText = `display: flex; flex-direction: column; gap: 5px;`;
        group.timers?.forEach((timer, timerIndex) => {
            const timerDiv = createTimerElement(timer, group, index, timerIndex, theme, secondaryColor);
            container.appendChild(timerDiv);
        });
        return container;
    }

    function createTimerElement(timer, group, groupIndex, timerIndex, theme, secondaryColor) {
        const timerDiv = document.createElement('div');
        timerDiv.style.cssText = `background-color: ${secondaryColor}; padding: 5px; border-radius: 3px; display: flex; justify-content: space-between; align-items: center; position: relative;`;
        const timerName = document.createElement('span');
        timerName.textContent = timer.name;
        timerName.style.cssText = `color: ${theme.TEXT};`;
        timerDiv.appendChild(timerName);
        const timeLeft = document.createElement('span');
        timeLeft.style.cssText = `color: ${theme.TEXT}; font-weight: bold;`;

        function updateTimer() {
            const now = Date.now();
            const remainingTime = timer.endTime - now;
            if (remainingTime <= 0) {
                timeLeft.textContent = 'Finished';
                timeLeft.style.color = theme.DANGER;
                startFlashing(timerDiv, group, groupIndex, timerIndex, theme);
                clearInterval(timerDiv.dataset.timerId);
            } else {
                const totalHours = Math.floor(remainingTime / (1000 * 60 * 60));
                const days = Math.floor(totalHours / 24);
                const hours = totalHours % 24;
                const minutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));
                const seconds = Math.floor((remainingTime % (60 * 1000)) / 1000);
                let timeString = '';
                if (days > 0) timeString += `${days}d `;
                if (hours > 0 || days > 0) timeString += `${hours}h `;
                if (minutes > 0 || hours > 0 || days > 0) timeString += `${minutes}m `;
                timeString += `${seconds}s`;
                timeLeft.textContent = timeString;
            }
        }
        updateTimer();
        timerDiv.dataset.timerId = setInterval(updateTimer, 1000);
        const rightContainer = document.createElement('div');
        rightContainer.style.cssText = `display: flex; align-items: center; gap: 10px;`;
        rightContainer.appendChild(timeLeft);
        if (state.isDeleteMode) {
            const deleteButton = dom.createDeleteButton(theme, undefined, () => {
                const theme = utils.getTheme();
                dialogs.confirmDelete('Delete this timer?', theme, () => {
                    clearInterval(timerDiv.dataset.timerId);
                    if (timerDiv.dataset.flashInterval) {
                        clearInterval(parseInt(timerDiv.dataset.flashInterval));
                    }
                    group.timers.splice(timerIndex, 1);
                    utils.saveState(`${CONSTANTS.STATE_KEYS.COUNTDOWN_GROUPS}_${state.currentPage}`, state.countdownGroups);
                    refreshSidebar();
                    utils.showToast(`Timer "${timer.name}" deleted`, 'info');
                });
            });
            rightContainer.appendChild(deleteButton);
        }
        timerDiv.appendChild(rightContainer);
        return timerDiv;
    }

    function startFlashing(timerDiv, group, groupIndex, timerIndex, theme) {
        let isFlashing = false;
        const flashInterval = setInterval(() => {
            isFlashing = !isFlashing;
            timerDiv.style.backgroundColor = isFlashing ? theme.DANGER : theme.BG;
        }, 500);
        timerDiv.dataset.flashInterval = flashInterval.toString();
    }
    async function openColorPicker(element, index, theme) {
        const overlay = dom.createOverlay(theme);
        return new Promise((resolve) => {
            const colorPickerContainer = document.createElement('div');
            colorPickerContainer.style.cssText = `background-color: ${theme.SECONDARY_BG}; padding: 20px; border-radius: 5px; min-width: 300px; border: 1px solid ${theme.BORDER}; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);`;
            const header = document.createElement('h3');
            header.textContent = 'Pick a Color';
            header.style.cssText = `margin-top: 0; margin-bottom: 15px; color: ${theme.TEXT};`;
            const colorInput = document.createElement('input');
            colorInput.type = 'color';
            colorInput.value = element.color || theme.SECONDARY_BG;
            colorInput.style.cssText = `width: 100%; height: 40px; margin-bottom: 15px; cursor: pointer;`;
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = `display: flex; justify-content: flex-end; gap: 10px;`;
            const saveButton = document.createElement('button');
            saveButton.textContent = 'Save';
            saveButton.style.cssText = `padding: 5px 15px; background-color: ${theme.BUTTON_BG}; color: white; border: none; border-radius: 3px; cursor: pointer;`;
            const cancelButton = document.createElement('button');
            cancelButton.textContent = 'Cancel';
            cancelButton.style.cssText = `padding: 5px 15px; background-color: ${theme.DANGER}; color: white; border: none; border-radius: 3px; cursor: pointer;`;
            saveButton.addEventListener('click', () => {
                document.body.removeChild(overlay);
                resolve({
                    elementColor: colorInput.value,
                    index: index
                });
            });
            cancelButton.addEventListener('click', () => {
                document.body.removeChild(overlay);
                resolve(null);
            });
            buttonContainer.appendChild(cancelButton);
            buttonContainer.appendChild(saveButton);
            colorPickerContainer.appendChild(header);
            colorPickerContainer.appendChild(colorInput);
            colorPickerContainer.appendChild(buttonContainer);
            overlay.appendChild(colorPickerContainer);
            document.body.appendChild(overlay);
        });
    }

    function createPaymentInput(entry, index, theme) {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'display: flex; gap: 5px; align-items: center;';
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Payment';
        input.style.cssText = `width: 80px; padding: 4px 6px; border-radius: 3px; border: 1px solid ${theme.BORDER}; background-color: ${theme.BG}; color: ${theme.TEXT}; font-size: 13px;`;
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/[^\d]/g, '');
            if (value) {
                value = parseInt(value).toLocaleString();
                e.target.value = value;
            }
        });
        const applyButton = document.createElement('button');
        applyButton.textContent = 'Apply';
        applyButton.className = 'no-drag';
        applyButton.style.cssText = `background-color: ${theme.SUCCESS}; color: white; border: none; padding: 4px 8px; cursor: pointer; border-radius: 3px; font-size: 13px;`;
        applyButton.addEventListener('click', () => {
            if (!input.value) {
                alert('Please enter a payment amount');
                return;
            }
            const payment = parseFloat(input.value.replace(/,/g, ''));
            if (isNaN(payment) || payment <= 0) {
                alert('Please enter a valid payment amount');
                return;
            }
            const theme = utils.getTheme();
            if (payment > entry.amount) {
                dialogs.confirmDelete(`The payment ($${payment.toLocaleString()}) is greater than the remaining loan amount ($${entry.amount.toLocaleString()}). The excess will be ignored. Continue?`, theme, () => {
                    processPayment(payment);
                });
            } else {
                dialogs.confirmDelete(`Apply payment of $${payment.toLocaleString()}?`, theme, () => {
                    processPayment(payment);
                });
            }
        });

        function processPayment(payment) {
            const timestamp = Date.now();
            const actualPayment = Math.min(payment, entry.amount);
            if (!entry.payments) entry.payments = [];
            entry.payments.push({
                amount: actualPayment,
                date: timestamp,
                remaining: entry.amount - actualPayment
            });
            entry.amount -= actualPayment;
            if (entry.amount <= 0) {
                entry.amount = 0;
                const paymentWrapper = wrapper.parentNode;
                const paidIndicator = document.createElement('div');
                paidIndicator.textContent = 'PAID';
                paidIndicator.style.cssText = `position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 24px; color: ${theme.SUCCESS}; font-weight: bold;`;
                paymentWrapper.parentNode.appendChild(paidIndicator);
            }
            utils.saveState(`${CONSTANTS.STATE_KEYS.LOAN_TRACKER}_${state.currentPage}`, state.loanTracker);
            refreshSidebar();
            utils.showToast(`Payment of $${payment.toLocaleString()} applied`, 'success');
        }
        wrapper.appendChild(input);
        wrapper.appendChild(applyButton);
        return wrapper;
    }

    function updateAllElementStyles() {
        const theme = utils.getTheme();
        const sidebar = document.getElementById('enhanced-sidebar');
        if (sidebar) {
            sidebar.style.backgroundColor = theme.BG;
            sidebar.style.color = theme.TEXT;
            sidebar.style.borderRightColor = theme.BORDER;
            const topBar = document.getElementById('top-bar');
            if (topBar) {
                topBar.style.backgroundColor = '#2c2c2c';
                topBar.style.borderBottomColor = '#444444';
            }
            const pageSelector = document.getElementById('page-selector');
            if (pageSelector) {
                const currentPageCircle = pageSelector.querySelector('div:first-child');
                if (currentPageCircle) {
                    currentPageCircle.style.backgroundColor = theme.BottomButtonBG;
                    currentPageCircle.style.color = theme.TEXT;
                }
                const pageMenu = document.getElementById('page-menu');
                if (pageMenu) {
                    const pageCircles = pageMenu.querySelectorAll('div');
                    pageCircles.forEach((circle, i) => {
                        circle.style.backgroundColor = i === state.currentPage ? theme.BUTTON_BG : theme.BG;
                        circle.style.color = theme.TEXT;
                        circle.style.borderColor = theme.BORDER;
                    });
                }
            }
        }
        const tagline = document.querySelector('#enhanced-sidebar > div:nth-child(3)');
        if (tagline) {
            tagline.style.color = theme.TEXT;
        }
        document.querySelectorAll('.draggable').forEach(element => {
            const type = element.dataset.type;
            let primaryColor;
            switch (type) {
                case 'group':
                    primaryColor = element.group?.color || theme.SECONDARY_BG;
                    break;
                case 'notepad':
                    primaryColor = element.notepad?.color || (state.isLightMode ? '#e6eded' : '#1a2a29');
                    break;
                case 'attackList':
                    primaryColor = element.attackList?.color || (state.isLightMode ? '#f7e6e6' : '#331f1f');
                    break;
                case 'todoList':
                    primaryColor = element.todoList?.color || theme.SECONDARY_BG;
                    break;
                default:
                    primaryColor = theme.SECONDARY_BG;
            }
            element.style.backgroundColor = primaryColor;
            const secondaryColor = utils.getSecondaryColor(primaryColor);
            element.style.borderColor = secondaryColor;
            const header = element.querySelector('div:first-child');
            if (header) {
                header.style.backgroundColor = secondaryColor;
                header.style.color = theme.TEXT;
            }
        });
        const addMenu = document.getElementById('addMenu');
        if (addMenu) {
            addMenu.style.backgroundColor = theme.SECONDARY_BG;
            addMenu.style.borderColor = theme.BORDER;
            const buttons = addMenu.querySelectorAll('button');
            buttons.forEach(button => {
                button.style.backgroundColor = theme.BG;
                button.style.color = theme.TEXT;
                button.style.borderColor = theme.BORDER;
            });
        }
        refreshSidebar();
    }

    function setupDailyReset(index) {
        const now = new Date();
        const utcHour = now.getUTCHours();
        const utcMinute = now.getUTCMinutes();
        const minutesUntilReset = (24 - utcHour) * 60 - utcMinute;
        setTimeout(() => {
            state.todoLists[index].items = state.todoLists[index].items.map(item => ({
                ...item,
                checked: false
            }));
            utils.saveState(`${CONSTANTS.STATE_KEYS.TODO_LISTS}_${state.currentPage}`, state.todoLists);
            refreshSidebar();
            setupDailyReset(index);
        }, minutesUntilReset * 60 * 1000);
    }

    function updateDayResetCountdown(element) {
        const now = new Date();
        const utcHours = now.getUTCHours();
        const utcMinutes = now.getUTCMinutes();
        const utcSeconds = now.getUTCSeconds();
        const minutesUntilReset = ((24 - utcHours) * 60) - utcMinutes;
        const secondsUntilReset = (minutesUntilReset * 60) - utcSeconds;
        const hours = Math.floor(minutesUntilReset / 60);
        const minutes = minutesUntilReset % 60;
        const seconds = secondsUntilReset % 60;
        element.textContent = `Reset in: ${hours}h ${minutes}m ${seconds}s`;
    }

    function showClock() {
        const theme = utils.getTheme();
        const sidebar = document.getElementById('enhanced-sidebar');
        if (!sidebar || !state.clockVisible) return;
        const clockContainer = document.createElement('div');
        clockContainer.id = 'torn-city-clock';
        clockContainer.style.cssText = `
    position: absolute;
    top: 60px;
    right: 10px;
    background-color: ${theme.SECONDARY_BG};
    border: 1px solid ${theme.BORDER};
    border-radius: 5px;
    padding: 10px;
    width: 220px;
    z-index: 991200;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    color: ${theme.TEXT};
    text-align: center;
    `;
        const timeDisplay = document.createElement('div');
        timeDisplay.style.cssText = `
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 5px;
    `;
        const dateDisplay = document.createElement('div');
        dateDisplay.style.cssText = `
    font-size: 14px;
    margin-bottom: 8px;
    `;
        const resetCountdown = document.createElement('div');
        resetCountdown.style.cssText = `
    font-size: 14px;
    padding-top: 5px;
    border-top: 1px solid ${theme.BORDER};
    font-weight: bold;
    `;
        clockContainer.appendChild(timeDisplay);
        clockContainer.appendChild(dateDisplay);
        clockContainer.appendChild(resetCountdown);
        sidebar.appendChild(clockContainer);

        function updateClock() {
            if (!state.clockVisible) return;
            const now = new Date();
            const utcHours = now.getUTCHours();
            const utcMinutes = now.getUTCMinutes();
            const utcSeconds = now.getUTCSeconds();
            const timeString =
                `${utcHours.toString().padStart(2, '0')}:${utcMinutes.toString().padStart(2, '0')}:${utcSeconds.toString().padStart(2, '0')}`;
            const options = {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                timeZone: 'UTC'
            };
            const dateString = now.toLocaleDateString('en-US', options);
            timeDisplay.textContent = timeString;
            dateDisplay.textContent = dateString;
            updateDayResetCountdown(resetCountdown);
        }
        updateClock();
        clockContainer.dataset.intervalId = setInterval(updateClock, 1000);
        document.addEventListener('click', function closeClockOutside(e) {
            if (state.clockVisible && clockContainer && !clockContainer.contains(e.target) && e.target.id !== 'clockButton') {
                actions.toggleClock();
                document.removeEventListener('click', closeClockOutside);
            }
        });
    }

    function updateSidebarBtnPosition(position) {
        const toggleButton = document.getElementById('sidebar-toggle');
        if (!toggleButton) return;
        localStorage.setItem('sidebarBtnPos', position);
        requestAnimationFrame(() => {
            let top, left, bottom, right;
            switch (position) {
                case 'top-left':
                    top = '10px';
                    left = '10px';
                    bottom = 'auto';
                    right = 'auto';
                    break;
                case 'top-right':
                    top = '10px';
                    right = '10px';
                    left = 'auto';
                    bottom = 'auto';
                    break;
                case 'bottom-left':
                    bottom = '85px';
                    left = '10px';
                    top = 'auto';
                    right = 'auto';
                    break;
                case 'bottom-right':
                    bottom = '85px';
                    right = '10px';
                    top = 'auto';
                    left = 'auto';
                    break;
                default:
                    top = '10px';
                    left = '10px';
                    bottom = 'auto';
                    right = 'auto';
                    break;
            }
            toggleButton.style.transition = 'all 0.3s ease';
            toggleButton.style.top = top;
            toggleButton.style.left = left;
            toggleButton.style.bottom = bottom;
            toggleButton.style.right = right;
        });
    }

    function exportAllData() {
        const data = {
            groups: state.groups,
            notepads: state.notepads,
            attackLists: state.attackLists,
            todoLists: state.todoLists,
            loanTracker: state.loanTracker,
            auctionTracker: state.auctionTracker,
            countdownGroups: state.countdownGroups,
            manualCountdownGroups: state.manualCountdownGroups,
            isLightMode: state.isLightMode,
            currentPage: state.currentPage,
            pageData: state.pageData
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sidewinder_backup.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        utils.showToast('Data exported successfully', 'success');
    }

    function addDebugManager() {
        const pageSelector = document.getElementById('page-selector');
        if (!pageSelector) return;
        const debugButton = document.createElement('div');
        debugButton.id = 'debug-button';
        debugButton.style.cssText = `
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: ${utils.getTheme().BottomButtonBG};
    color: ${utils.getTheme().TEXT};
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease;
    position: absolute;
    bottom: -40px;
    z-index: 991101;
    `;
        const settingsIcon = document.createElement('img');
        settingsIcon.src = chrome.runtime.getURL('assets/settings.svg');
        settingsIcon.alt = 'Settings';
        settingsIcon.style.cssText = 'width: 12px; height: 12px; vertical-align: middle;';
        debugButton.appendChild(settingsIcon);
        const tooltip = document.createElement('div');
        tooltip.textContent = 'Settings';
        tooltip.style.cssText = `
    position: absolute;
    background-color: ${utils.getTheme().HEADER};
    color: ${utils.getTheme().TEXT};
    padding: 5px 8px;
    border-radius: 4px;
    font-size: 12px;
    bottom: 0;
    right: -10px;
    transform: translateX(100%);
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s, visibility 0.3s;
    pointer-events: none;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    `;
        debugButton.appendChild(tooltip);
        debugButton.addEventListener('mouseenter', () => {
            debugButton.style.backgroundColor = utils.getTheme().SECONDARY_BG;
            debugButton.style.transform = 'scale(1.1)';
            tooltip.style.opacity = '1';
            tooltip.style.visibility = 'visible';
        });
        debugButton.addEventListener('mouseleave', () => {
            debugButton.style.backgroundColor = utils.getTheme().BottomButtonBG;
            debugButton.style.transform = 'scale(1)';
            tooltip.style.opacity = '0';
            tooltip.style.visibility = 'hidden';
        });
        debugButton.addEventListener('click', () => {
            if (!state.debugMenuOpen) {
                state.debugMenuOpen = true;
                showDebugMenu();
            }
        });
        pageSelector.appendChild(debugButton);
        document.addEventListener('keydown', (e) => {
            if (!isTypingOrFocused && e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') {
                e.preventDefault();
                if (!state.debugMenuOpen) {
                    state.debugMenuOpen = true;
                    showDebugMenu();
                }
            }
        });
        CONSTANTS.DEBUG_VERSION = '1.0';
        if (typeof state.debugMenuOpen === 'undefined') {
            state.debugMenuOpen = false;
        }
    }

    function importAllData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    Object.assign(state, data);
                    Object.keys(data).forEach(key => {
                        utils.saveState(`${CONSTANTS.STATE_KEYS[key.toUpperCase()]}_${state.currentPage}`, data[key]);
                    });
                    refreshSidebar();
                    utils.showToast('Data imported successfully', 'success');
                } catch (error) {
                    console.error('Import error:', error);
                    utils.showToast('Error importing data', 'error');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    function resetAllData() {
        const keys = Object.values(CONSTANTS.STATE_KEYS);
        keys.forEach(key => {
            for (let i = 0; i < 3; i++) {
                localStorage.removeItem(`${key}_${i}`);
                localStorage.removeItem(`${key}_${i}_backup`);
                localStorage.removeItem(`${key}_${i}_updatedAt`);
            }
        });
        state.groups = [];
        state.notepads = [];
        state.attackLists = [];
        state.todoLists = [];
        state.loanTracker = null;
        state.auctionTracker = null;
        state.countdownGroups = [];
        state.manualCountdownGroups = [];
        state.currentPage = 0;
        state.pageData = [{}, {}, {}];
        Object.keys(state).forEach(key => {
            if (CONSTANTS.STATE_KEYS[key.toUpperCase()]) {
                utils.saveState(`${CONSTANTS.STATE_KEYS[key.toUpperCase()]}_${state.currentPage}`, state[key]);
            }
        });
        refreshSidebar();
        utils.showToast('All data reset successfully', 'success');
    }

    function fixTrackers() {
        let fixed = false;
        if (state.loanTracker) {
            if (typeof state.loanTracker !== 'object') {
                state.loanTracker = {
                    entries: []
                };
                fixed = true;
            }
            if (!Array.isArray(state.loanTracker.entries)) {
                state.loanTracker.entries = [];
                fixed = true;
            }
            utils.saveState(`${CONSTANTS.STATE_KEYS.LOAN_TRACKER}_${state.currentPage}`, state.loanTracker);
        }
        if (state.auctionTracker) {
            if (typeof state.auctionTracker !== 'object') {
                state.auctionTracker = {
                    auctions: []
                };
                fixed = true;
            }
            if (!Array.isArray(state.auctionTracker.auctions)) {
                state.auctionTracker.auctions = [];
                fixed = true;
            }
            utils.saveState(`${CONSTANTS.STATE_KEYS.AUCTION_TRACKER}_${state.currentPage}`, state.auctionTracker);
        }
        if (fixed) {
            refreshSidebar();
            utils.showToast('Trackers fixed', 'success');
        } else {
            utils.showToast('No issues found with trackers', 'info');
        }
    }

    function showDebugMenu() {
        const theme = utils.getTheme();
        const overlay = dom.createOverlay(theme);
        const menu = document.createElement('div');
        menu.style.cssText = `
    background-color: ${theme.BG};
    padding: 20px;
    border-radius: 8px;
    width: 450px;
    border: 1px solid ${theme.BORDER};
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    `;
        const style = document.createElement('style');
        style.textContent = `
    .settings-section {
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 1px solid ${theme.BORDER};
    }
    .settings-title {
        color: ${theme.TEXT};
        margin-bottom: 10px;
        font-weight: bold;
    }
    .settings-button {
        background: ${theme.BUTTON_BG};
        color: ${theme.TEXT};
        border: none;
        padding: 8px 12px;
        border-radius: 4px;
        cursor: pointer;
        margin: 5px;
        transition: background 0.2s;
    }
    .settings-button:hover {
        background: ${utils.getLighterColor(theme.BUTTON_BG)};
    }
    .settings-button.danger {
        background: ${theme.DANGER};
        color: white;
    }
    .button-group {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }
    .radio-group {
        display: flex;
        gap: 10px;
        margin: 10px 0;
    }
    .radio-option {
        display: flex;
        align-items: center;
        gap: 5px;
        cursor: pointer;
        padding: 5px;
        border-radius: 3px;
        transition: background 0.2s;
    }
    .radio-option:hover {
        background: ${theme.SECONDARY_BG};
    }
    .status-text {
        color: ${theme.subTEXT};
        font-size: 12px;
        margin-top: 5px;
    }
    `;
        document.head.appendChild(style);
        menu.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2 style="color: ${theme.TEXT}; margin: 0;">SideWinder Settings</h2>
        <button id="debug-close" class="settings-button">✕</button>
    </div>
    <div class="settings-section">
        <div class="settings-title">Theme</div>
            <button id="debug-theme" class="settings-button">
            Switch to ${state.isLightMode ? 'Dark' : 'Light'} Mode
        </button>
    </div>
    <div class="settings-section">
    <div class="settings-title">Sidebar Position</div>
    <label class="radio-option">
        <input type="checkbox" id="debug-sidebar-position" ${state.isSidebarRight ? 'checked' : ''}>
        <span style="color: ${theme.TEXT}">Right Side</span>
    </label>
    <div class="status-text">Move sidebar to the right side of the screen</div>
    </div>
    <div class="settings-section">
        <div class="settings-title">Toggle Button Position</div>
        <div class="radio-group">
            <label class="radio-option">
            <input type="radio" name="sidebar-btn-pos" value="top-left">
            <span style="color: ${theme.TEXT}">Top Left</span>
            </label>
            <label class="radio-option">
            <input type="radio" name="sidebar-btn-pos" value="top-right">
            <span style="color: ${theme.TEXT}">Top Right</span>
            </label>
            <label class="radio-option">
            <input type="radio" name="sidebar-btn-pos" value="bottom-left">
            <span style="color: ${theme.TEXT}">Bottom Left</span>
            </label>
            <label class="radio-option">
            <input type="radio" name="sidebar-btn-pos" value="bottom-right">
            <span style="color: ${theme.TEXT}">Bottom Right</span>
            </label>
        </div>
    </div>
    <div class="settings-section">
        <div class="settings-title">Auto Width</div>
            <label class="radio-option">
            <input type="checkbox" id="debug-auto-width" ${state.isAutoWidth ? 'checked' : ''}>
            <span style="color: ${theme.TEXT}">Enable Auto Width</span>
            </label>
        <div class="status-text">Automatically adjust sidebar width based on content</div>
    </div>
    <div class="settings-section">
        <div class="settings-title">Data Management</div>
        <div class="button-group">
            <button id="debug-export" class="settings-button">Export Data</button>
            <button id="debug-import" class="settings-button">Import Data</button>
            <button id="debug-validate" class="settings-button">Validate Data</button>
            <button id="debug-fix-trackers" class="settings-button">Fix Trackers</button>
            <button id="debug-refresh" class="settings-button">Refresh Sidebar</button>
            <button id="debug-reset" class="settings-button danger">Reset All Data</button>
        </div>
    </div>
    `;
        overlay.appendChild(menu);
        document.body.appendChild(overlay);
        const savedBtnPos = localStorage.getItem('sidebarBtnPos') || 'top-left';
        const btnPosRadios = menu.querySelectorAll('input[name="sidebar-btn-pos"]');
        btnPosRadios.forEach(radio => {
            radio.checked = (radio.value === savedBtnPos);
            radio.addEventListener('change', (e) => {
                const newPosition = e.target.value;
                updateSidebarBtnPosition(newPosition);
                utils.showToast('Button position updated', 'success');
            });
        });
        menu.querySelector('#debug-close').addEventListener('click', () => {
            document.body.removeChild(overlay);
            state.debugMenuOpen = false;
        });
        menu.querySelector('#debug-export').addEventListener('click', () => {
            exportAllData();
        });
        menu.querySelector('#debug-import').addEventListener('click', () => {
            importAllData();
        });
        menu.querySelector('#debug-reset').addEventListener('click', () => {
            const theme = utils.getTheme();
            dialogs.confirmDelete('This will reset ALL SideWinder data. Are you sure?', theme, () => {
                resetAllData();
                document.body.removeChild(overlay);
                state.debugMenuOpen = false;
            });
        });
        menu.querySelector('#debug-validate').addEventListener('click', () => {
            utils.validateState();
            utils.showToast('Data validated', 'success');
        });
        menu.querySelector('#debug-fix-trackers').addEventListener('click', () => {
            fixTrackers();
            utils.showToast('Trackers fixed', 'success');
        });
        menu.querySelector('#debug-refresh').addEventListener('click', () => {
            refreshSidebar();
            utils.showToast('Sidebar refreshed', 'success');
        });
        menu.querySelector('#debug-theme').addEventListener('click', () => {
            actions.toggleLightMode();
            document.body.removeChild(overlay);
            state.debugMenuOpen = false;
            setTimeout(() => {
                showDebugMenu();
            }, 300);
        });
        const autoWidthCheckbox = menu.querySelector('#debug-auto-width');
        if (autoWidthCheckbox) {
            autoWidthCheckbox.checked = state.isAutoWidth;
            autoWidthCheckbox.addEventListener('change', async (e) => {
                state.isAutoWidth = e.target.checked;
                localStorage.setItem('sidebarAutoWidth', state.isAutoWidth ? '1' : '0');
                await utils.applySidebarWidth();
                refreshSidebar();
                setTimeout(async () => {
                    await utils.applySidebarWidth();
                }, 100);
            });
        }
        const sidebarPositionCheckbox = menu.querySelector('#debug-sidebar-position');
        if (sidebarPositionCheckbox) {
            sidebarPositionCheckbox.checked = state.isSidebarRight;
            sidebarPositionCheckbox.addEventListener('change', (e) => {
                state.isSidebarRight = e.target.checked;
                utils.saveState(CONSTANTS.STATE_KEYS.SIDEBAR_POSITION, state.isSidebarRight);
                const sidebar = document.getElementById('enhanced-sidebar');
                const resizer = document.getElementById('sidebar-width-resizer');
                const theme = utils.getTheme();

                if (sidebar) {
                    sidebar.style.left = state.isSidebarRight ? 'auto' : '0';
                    sidebar.style.right = state.isSidebarRight ? '0' : 'auto';
                    sidebar.style.borderLeft = state.isSidebarRight ? `2px solid ${theme.BORDER}` : 'none';
                    sidebar.style.borderRight = state.isSidebarRight ? 'none' : `2px solid ${theme.BORDER}`;

                    const persistentState = utils.loadState(CONSTANTS.STATE_KEYS.SIDEBAR_STATE, {
                        isHidden: false
                    });
                    if (persistentState.isHidden) {
                        sidebar.style.transform = `translateX(${state.isSidebarRight ? '-102%' : '-102%'})`;
                    }
                }

                if (resizer) {
                    resizer.style.left = state.isSidebarRight ? '0' : 'auto';
                    resizer.style.right = state.isSidebarRight ? 'auto' : '0';
                    resizer.style.cursor = state.isSidebarRight ? 'w-resize' : 'ew-resize';
                }

                utils.showToast(`Sidebar moved to ${state.isSidebarRight ? 'right' : 'left'} side`, 'info');
            });
        }
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
                state.debugMenuOpen = false;
            }
        });
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                document.body.removeChild(overlay);
                state.debugMenuOpen = false;
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }

    function createMagneticResizer(element, isLightMode, isEditMode, onResize) {
        const CONSTANTS = {
            MIN_GROUP_WIDTH: 100,
            MIN_GROUP_HEIGHT: 100,
            RESIZER_SIZE: 20,
            MAGNET_THRESHOLD: 20,
            SNAP_THRESHOLD: 10,
            SNAP_STRENGTH: 0.8,
            THROTTLE_DELAY: 16,
            COMMON_SIZES: [{
                    width: 200,
                    height: 150
                },
                {
                    width: 300,
                    height: 200
                },
                {
                    width: 400,
                    height: 300
                },
                {
                    width: 500,
                    height: 400
                },
                {
                    width: 600,
                    height: 450
                }
            ]
        };
        const resizer = document.createElement('div');
        resizer.setAttribute('data-resizer', 'true');
        resizer.style.cssText = `
width: ${CONSTANTS.RESIZER_SIZE}px;
height: ${CONSTANTS.RESIZER_SIZE}px;
background-color: ${isLightMode ? '#999' : '#666'};
position: absolute;
right: 0;
bottom: 0;
cursor: se-resize;
border-radius: 0 0 5px 0;
display: ${isEditMode ? 'flex' : 'none'};
align-items: center;
justify-content: center;
color: white;
font-size: 12px;
transition: background-color 0.2s;
z-index: 9910;
will-change: transform;
transform: translateZ(0);
`;
        resizer.innerHTML = '⮧';
        const createIndicators = () => {
            const indicators = {
                horizontal: document.createElement('div'),
                vertical: document.createElement('div'),
                tooltip: document.createElement('div')
            };
            indicators.horizontal.className = 'snap-indicator resize-horizontal-indicator';
            indicators.horizontal.style.cssText = `
    position: fixed;
    background-color: #4d90fe;
    pointer-events: none;
    z-index: 9999;
    height: 1px;
    display: none;
    transform: translateZ(0);
    `;
            indicators.vertical.className = 'snap-indicator resize-vertical-indicator';
            indicators.vertical.style.cssText = `
    position: fixed;
    background-color: #4d90fe;
    pointer-events: none;
    z-index: 9999;
    width: 1px;
    display: none;
    transform: translateZ(0);
    `;
            indicators.tooltip.className = 'dimension-tooltip';
            indicators.tooltip.style.cssText = `
    position: fixed;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    pointer-events: none;
    z-index: 9999;
    display: none;
    transform: translateZ(0);
    `;
            document.body.appendChild(indicators.horizontal);
            document.body.appendChild(indicators.vertical);
            document.body.appendChild(indicators.tooltip);
            return indicators;
        };
        const indicators = createIndicators();
        const utils = {
            throttle: (callback, delay) => {
                let lastCall = 0;
                let requestId = null;
                return function(...args) {
                    const now = performance.now();
                    if (now - lastCall >= delay) {
                        lastCall = now;
                        callback(...args);
                    } else if (!requestId) {
                        requestId = requestAnimationFrame(() => {
                            requestId = null;
                            lastCall = performance.now();
                            callback(...args);
                        });
                    }
                };
            },
            showDimensionTooltip: (x, y, width, height) => {
                indicators.tooltip.textContent = `${Math.round(width)}px × ${Math.round(height)}px`;
                indicators.tooltip.style.display = 'block';
                indicators.tooltip.style.left = `${x + 10}px`;
                indicators.tooltip.style.top = `${y + 10}px`;
            },
            hideIndicators: () => {
                indicators.horizontal.style.display = 'none';
                indicators.vertical.style.display = 'none';
                indicators.tooltip.style.display = 'none';
            },
            getInitialDimensions: () => {
                const contentContainer = element.querySelector('.content-container');
                const contentHeight = contentContainer ? contentContainer.scrollHeight + 60 : CONSTANTS.MIN_GROUP_HEIGHT;
                const minHeight = Math.max(CONSTANTS.MIN_GROUP_HEIGHT, contentHeight);
                const sidebar = document.getElementById('enhanced-sidebar');
                const sidebarRect = sidebar.getBoundingClientRect();
                const elementRect = element.getBoundingClientRect();
                return {
                    minHeight,
                    maxWidth: sidebarRect.right - elementRect.left - 20,
                    maxHeight: sidebarRect.bottom - elementRect.top - 20,
                    elementRect
                };
            },
            calculateNewDimensions: (deltaX, deltaY, startDims, constraints) => {
                let newWidth = Math.max(CONSTANTS.MIN_GROUP_WIDTH, startDims.width + deltaX);
                let newHeight = Math.max(constraints.minHeight, startDims.height + deltaY);
                newWidth = Math.min(newWidth, constraints.maxWidth);
                newHeight = Math.min(newHeight, constraints.maxHeight);
                return {
                    newWidth,
                    newHeight
                };
            },
            applyDimensions: (width, height, clientX, clientY) => {
                requestAnimationFrame(() => {
                    element.style.width = `${width}px`;
                    element.style.height = `${height}px`;
                    utils.showDimensionTooltip(clientX, clientY, width, height);
                });
            }
        };
        const createResizeHandler = (startEvent, isTouch) => {
            startEvent.preventDefault();
            startEvent.stopPropagation();
            state.isGlobalResizing = true;
            element.querySelectorAll('[data-timer-id], [data-flash-interval]').forEach(el => {
                const timerId = el.dataset.timerId;
                const flashId = el.dataset.flashInterval;
                if (timerId) clearInterval(Number(timerId));
                if (flashId) clearInterval(Number(flashId));
            });
            const startCoords = {
                x: isTouch ? startEvent.touches[0].clientX : startEvent.clientX,
                y: isTouch ? startEvent.touches[0].clientY : startEvent.clientY,
                width: element.offsetWidth,
                height: element.offsetHeight
            };
            const constraints = utils.getInitialDimensions();
            const handleMove = utils.throttle((moveEvent) => {
                const currentCoords = {
                    x: isTouch ? moveEvent.touches[0].clientX : moveEvent.clientX,
                    y: isTouch ? moveEvent.touches[0].clientY : moveEvent.clientY
                };
                const deltaX = currentCoords.x - startCoords.x;
                const deltaY = currentCoords.y - startCoords.y;
                const {
                    newWidth,
                    newHeight
                } = utils.calculateNewDimensions(
                    deltaX,
                    deltaY, {
                        width: startCoords.width,
                        height: startCoords.height
                    },
                    constraints
                );
                utils.applyDimensions(newWidth, newHeight, currentCoords.x, currentCoords.y);
            }, CONSTANTS.THROTTLE_DELAY);
            const handleEnd = () => {
                const moveEvent = isTouch ? 'touchmove' : 'mousemove';
                const endEvent = isTouch ? 'touchend' : 'mouseup';
                document.removeEventListener(moveEvent, handleMove);
                document.removeEventListener(endEvent, handleEnd);
                state.isGlobalResizing = false;
                utils.hideIndicators();
                const finalDimensions = {
                    width: parseInt(element.style.width),
                    height: parseInt(element.style.height)
                };
                if (onResize) {
                    onResize(finalDimensions.width, finalDimensions.height);
                }
                setTimeout(() => refreshSidebar(), 100);
            };
            const moveEvent = isTouch ? 'touchmove' : 'mousemove';
            const endEvent = isTouch ? 'touchend' : 'mouseup';
            document.addEventListener(moveEvent, handleMove, {
                passive: false
            });
            document.addEventListener(endEvent, handleEnd);
        };
        resizer.addEventListener('mousedown', e => createResizeHandler(e, false));
        resizer.addEventListener('touchstart', e => createResizeHandler(e, true), {
            passive: false
        });
        resizer.addEventListener('mouseover', () => {
            if (state.isEditMode) {
                resizer.style.backgroundColor = isLightMode ? '#aaa' : '#777';
            }
        });
        resizer.addEventListener('mouseout', () => {
            resizer.style.backgroundColor = isLightMode ? '#999' : '#666';
        });
        return resizer;
    }

    function addResizerStyles() {
        const styleEl = document.getElementById('resizer-styles') || document.createElement('style');
        styleEl.id = 'resizer-styles';
        styleEl.textContent = `
    [data-resizer] {
        will-change: transform;
        transform: translateZ(0);
        transition: background-color 0.2s;
    }
    [data-resizer]:hover::after {
        content: '';
        position: absolute;
        width: 8px;
        height: 8px;
        border-right: 2px solid white;
        border-bottom: 2px solid white;
        right: 5px;
        bottom: 5px;
        opacity: 0.7;
    }
    .snap-indicator {
        position: fixed;
        background-color: #4d90fe;
        pointer-events: none;
        z-index: 9999;
        transform: translateZ(0);
    }
    .dimension-tooltip {
        position: fixed;
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        pointer-events: none;
        z-index: 9999;
        transform: translateZ(0);
    }
    `;
        if (!styleEl.parentNode) document.head.appendChild(styleEl);
    }

    function addMobileOptimizations() {
        const styleEl = document.getElementById('mobile-styles') || document.createElement('style');
        styleEl.id = 'mobile-styles';
        styleEl.textContent = `
    @media (max-width: 768px) {
        #enhanced-sidebar {
            width: 100% !important;
            max-width: 100%;
            height: 100%;
            transform: translateX(-100%);
        }
        #enhanced-sidebar.visible {
            transform: translateX(0);
        }
        .draggable {
            touch-action: none;
            -webkit-user-select: none;
            user-select: none;
        }
        [data-resizer] {
            width: 30px !important;
            height: 30px !important;
            background-color: rgba(0, 0, 0, 0.5) !important;
        }
        .dimension-tooltip {
            font-size: 14px;
            padding: 8px 12px;
        }
        #sidebar-toggle {
            width: 48px;
            height: 48px;
            padding: 12px;
        }
        .no-drag {
            touch-action: auto;
        }
    }
    `;
        if (!styleEl.parentNode) document.head.appendChild(styleEl);
    }

    function createEditableName(element, name, type, index, theme) {
        const nameContainer = document.createElement('div');
        nameContainer.style.cssText = `
    flex-grow: 1;
    margin-right: 10px;
    `;
        const nameSpan = document.createElement('span');
        nameSpan.style.cssText = `
    color: ${theme.TEXT};
    outline: none;
    border: 1px solid ${state.isEditMode ? theme.BORDER : 'transparent'};
    border-radius: 3px;
    padding: 3px 7px;
    min-width: 50px;
    transition: all 0.2s ease;
    display: inline-block;
    background-color: ${state.isEditMode ? theme.BG : 'transparent'};
    cursor: ${state.isEditMode ? 'text' : 'default'};
    `;
        nameSpan.contentEditable = state.isEditMode;
        nameSpan.spellcheck = false;
        nameSpan.textContent = name;
        nameSpan.className = 'no-drag';
        nameSpan.addEventListener('mousedown', (e) => {
            if (state.isEditMode) {
                e.stopPropagation();
            }
        });
        nameSpan.addEventListener('focus', () => {
            if (state.isEditMode) {
                isTypingOrFocused = true;
            }
        });
        nameSpan.addEventListener('blur', () => {
            isTypingOrFocused = false;
            if (nameSpan.textContent.trim()) {
                const newName = nameSpan.textContent.trim();
                switch (type) {
                    case 'group':
                        state.groups[index].name = newName;
                        utils.saveState(`${CONSTANTS.STATE_KEYS.GROUPS}_${state.currentPage}`, state.groups);
                        break;
                    case 'notepad':
                        state.notepads[index].name = newName;
                        utils.saveState(`${CONSTANTS.STATE_KEYS.NOTEPADS}_${state.currentPage}`, state.notepads);
                        break;
                    case 'attackList':
                        state.attackLists[index].name = newName;
                        utils.saveState(`${CONSTANTS.STATE_KEYS.ATTACK_LISTS}_${state.currentPage}`, state.attackLists);
                        break;
                    case 'todoList':
                        state.todoLists[index].name = newName;
                        utils.saveState(`${CONSTANTS.STATE_KEYS.TODO_LISTS}_${state.currentPage}`, state.todoLists);
                        break;
                    case 'countdown':
                        state.countdownGroups[index].name = newName;
                        utils.saveState(`${CONSTANTS.STATE_KEYS.COUNTDOWN_GROUPS}_${state.currentPage}`, state.countdownGroups);
                        break;
                }
            } else {
                nameSpan.textContent = name;
            }
        });
        nameSpan.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                nameSpan.blur();
            }
        });
        nameContainer.appendChild(nameSpan);
        return nameContainer;
    }

    function init() {
        try {
            if (!CONSTANTS || !CONSTANTS.STATE_KEYS) {
                throw new Error('Constants not properly initialized');
            }
            actions.initializeState();
            addDragStyles();
            const sidebar = components.createSidebar();
            if (!sidebar) {
                throw new Error('Failed to create sidebar');
            }
            addMobileOptimizations();
            const container = document.getElementById('group-container');
            if (container) {
                setupDragListeners(container);
            }
            const savedBtnPos = localStorage.getItem('sidebarBtnPos') || 'top-left';
            updateSidebarBtnPosition(savedBtnPos);
            if (state.clockVisible) showClock();
            checkTodoListResets();
            addDebugManager();
            addResizerStyles();
            chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
                try {
                    if (request.action === 'refreshSidebar') {
                        refreshSidebar();
                    } else if (request.action === 'toggleLightMode') {
                        actions.toggleLightMode();
                    } else if (request.action === 'updateSidebarBtnPosition') {
                        updateSidebarBtnPosition(request.position);
                    }
                } catch (error) {
                    console.error('Error handling message:', error);
                }
            });
            window.refreshSidebar = refreshSidebar;
        } catch (error) {
            console.error('Error during initialization:', error);
        }
    }
    init();
})();