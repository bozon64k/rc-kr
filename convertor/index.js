import { readFileSync, writeFileSync } from 'node:fs';
import { json2csv } from 'json-2-csv';
import path from 'node:path';

const files = [
	"keyword_string",
	"skillbuff_string",
	"scoutenemy_string",
	"levelbrief_string",
	"string_string",
	"levelinfo_string",
	"loadingtips_string",
	"tutorialpic_new_string",
	"itemcollection_string",
	"itembuff_string",
	"levelmission_string",
	"terrainblock_string",
	"achievement_string",
	"weaponprepare_skill_preview_string",
	"unitbattle_string",
	"tutorialforce_string",
	"terrainbuff_string",
	"unitskin_string",
	"itemkey_string",
	"secretgeneinfo_string",
	"battlemessagebox_string",
	"gamesetting_string",
	"weaponaccessory_string",
	"playback_string",
	"storyoption_string",
	"secretfile_string",
	"tutorial_string",
	"weapon_string",
	"unitstatedesc_string",
	"storypuzzle_string",
	"secretfile_package_string",
	"itemteam_string",
	"modes_string",
	"uidepot_string",
	"uimain_string",
	"uibattlemain_string",
	"uipreparecompose_string",
	"uicompose_string",
	"uibattlemenu_string",
	"uiroleprofile_string",
	"uirolebattleinfo_string",
	"uiprepareproduct_string",
	"uireinforcechoose_string",
	"uiweaponprepare_string",
	"uiiteminfo_string",
	"uiaccessoryshop_string",
	"uilevelreplay_string",
	"uimainremake_string",
	"uiscout_string",
	"uiendlessresult_string",
	"uipreparemain_string",
	"uistorycollect_string",
	"uibagoverflow_string",
	"uiunitgene_string",
	"uibattlewin_string",
	"uilevelup_string",
	"uicollection_string",
	"uibattleprepare_string",
	"uiitemupgrade_string",
	"uistorydialog_string",
	"uisecretdocment_string",
	"uibattlesetting_string",
	"uimodechoose_string",
	"uitimemap_string",
	"uiunithud_string",
	"uicontinuetip_string",
	"uitacticsmenu_string",
	"uichallengeplus_string",
	"uibattlelose_string",
	"saveinfo_string",
	"uitutorialopen_string",
	"uitacticsmode_string",
	"uiendlessresultremake_string",
	"terrainbutton_string",
	"uisearchlight_string",
	"uitacticsmain_string",
	"uimissionbrief_string",
	"uipreparebubble_string",
	"uiartdocumentplay_string",
	"uiitemtip_string",
	"uigameload_string",
	"uitacticsrule_string",
	"uienemytip_string",
	"uisecretdocplay_string",
	"uitutorialskip_string",
	"uireinforceresult_string",
	"uigamesave_string",
	"uiskincollect_string",
	"uidialogrecord_string",
	"uimessagebox_string",
	"uiitemteam_string",
	"uigetitemplus_string",
	"uitutorial_string",
	"uilevelcollection_string",
	"uigetkeyitem_string",
	"uicgplayer_string",
	"uicutscene_string",
	"uigetitem_string",
	"uibattlehelp_string",
	"uitacticsresult_string",
	"uibattlewincj_string",
	"uiendlessaward_string",
	"uisecretgenetips_string",
	"uimissioncomplete_string",
	"uiitemprepare_string",
	"uiunitheadbubble_string",
	"uikeywordcollect_string",
	"uiscoutbattle_string",
	"uiitemcollect_string",
	"uiskintip_string",
	"uiartdocument_string",
	"uikeyword_string",
	"uigamefinish_string",
	"storydialog_string",
	"skill_string",
	"item_string",
	"gamehelp_string"
];

const STRING_PATH = "../decompiler/output/assets/bakedconfig/strings";
async function main(file) {
	console.log(file);
	const f = readFileSync(path.resolve(STRING_PATH, `${file}.bytes`));
	const SerializationHeaderRecord = {
		RecordTypeEnum: f.subarray(0, 1), // 1바이트
		RootId: f.subarray(1, 5), // 4바이트
		HeaderId: f.subarray(5, 9), // 4바이트
		MajorVersion: f.subarray(9, 13), // 4바이트
		MinorVersion: f.subarray(13, 17), // 4바이트
	};
	const BinaryLibrary = {
		RecordTypeEnum: f.subarray(17, 18), // 1바이트
		LibraryId: f.subarray(18, 22), // 4바이트
		LengthPrefixedString: f[22], // 가변 길이
		LibraryName: String(f.subarray(22, 23 + f[22])), // 가변 길이
	};
	const st1 = 23 + f[22];
	const BinaryArray = {
		RecordTypeEnum: f.subarray(st1, st1 + 1), // 1바이트
		ObjectId: f.subarray(st1 + 1, st1 + 5).readInt32LE(), // 4바이트
		BinaryArrayTypeEnum: f.subarray(st1 + 5, st1 + 6), // 4바이트
		Rank: f.subarray(st1 + 6, st1 + 10), // 4바이트
		Lengths: f.subarray(st1 + 10, st1 + 14).readInt32LE(), // 배열 길이
	};
	const st2 = st1 + 14;
	let st3 = 0;
	const SystemClassWithMembersAndTypes = {
		RecordTypeEnum: f.subarray(st2, st2 + 1), // 1바이트
		ClassInfo: {
			LengthPrefixedString: f.subarray(st2 + 1, st2 + 2), // 1바이트
			Name: String(f.subarray(st2 + 2, st2 + 2 + f[st2 + 1])),
		},
		MemberCount: f.subarray(st2 + 2 + f[st2 + 1], st2 + 2 + f[st2 + 1] + 4),
	};
	const MemberReferences = ((start) => {
		const refs = [];
		let pos = start;
		for (let i = 0; i < BinaryArray.Lengths; i++) {
			refs.push({
				RecordTypeEnum: f.subarray(pos, pos + 1),
				IdRef: f.subarray(pos + 1, pos + 5),
			});
			pos = pos + 5;
			st3 = pos;
		}
		return refs;
	})(st2 + 2 + f[st2 + 1] + 4);

	const st5 = st3;
	const st5_1 = st5 + 6 + f[st5 + 5];
	let st6 = 0;
	const ClassWithMembersAndTypes = {
		RecordTypeEnumeration: f.subarray(st5, st5 + 1),
		ClassInfo_ObjectId: f.subarray(st5 + 1, st5 + 5),
		ClassInfo_LengthPrefixedString: f.subarray(st5 + 5, st5 + 6),
		ClassInfo_Name: String(f.subarray(st5 + 6, st5_1)),
		ClassInfo_MemberCount: f.subarray(st5_1, st5_1 + 4), // 06 00 00 00 -> 리틀 엔디언 -> 6개
		ClassInfo_MemberNames: ((start) => {
			const members = [];
			let pos = start;
			for (let i = 0; i < 6; i++) {
				members.push(
					String(f.subarray(pos, pos + f[pos - 1]))
				);
				pos = pos + f[pos - 1] + 1;
				st6 = pos - 1;
			}
			return members;
		})(st5_1 + 5),
		ClassInfo_MemberTypeInfo: (() => {
			const types = [];
			for (let it of f.subarray(st6, st6 + 6)) {
				types.push(it);
			};
			return types;
		})(), // 6개 멤버의 타입. 아마 전부 01(String)일 것.


	};
	// 위에서 정의된 내용대로 값을 읽는 부분
	const ClassRecords = ((start) => {
		const records = [];
		let pos = start;
		for (let p = 0; p < BinaryArray.Lengths; p++) {
			const record = [];
			for (let i = 0; i < 6; i++) {
				// 0x06이면 String, 0x09면 MemberReference
				const data = {
					RecordTypeEnumeration: f.subarray(pos, pos + 1),
				};
				if (f[pos] === 0x06) {
					// 가변 길이 체크
					let realLengths = f[pos + 5];
					let add = 0;
					const lenfirst = f[pos + 5].toString(2).padStart(8, "0");
					if (lenfirst[0] === "1") {
						add += 1;
						const lensecond = f[pos + 6].toString(2).padStart(8, "0");
						if (lensecond[0] === "1") {
							console.log(pos);
							console.log(f.subarray(pos + 5, pos + 10));
							add += 1;
							const lenthrid = f[pos + 7].toString(2).padStart(8, "0");
							realLengths = parseInt(lenthrid.slice(1, 8) + lensecond.slice(1, 8) + lenfirst.slice(1, 8), 2);
							console.log("MORE!!!!!!!!!!!");
						} else {
							realLengths = parseInt(lensecond.slice(1, 8) + lenfirst.slice(1, 8), 2);
						}
					}
					data.ObjectId = f.subarray(pos + 1, pos + 5); // 4바이트
					data.Length = realLengths;
					data.value = String(f.subarray(
						pos + 6 + add,
						pos + 6 + add + realLengths,
					)); // 가변 길이

					pos = pos + add + 6 + realLengths;
					// (p === 0) && console.log({ pos, realLengths, add });
				} else if (f[pos] === 0x09) {
					data.ObjectId = f.subarray(pos + 1, pos + 5); // 4바이트
					pos = pos + 5;
				} else if (f[pos] === 0x0A) {
					pos = pos + 1;
					// ObjectNull
					// RecordTypeEnum 1바이트 외에 없음
				} else {
					// console.log("WTF?", pos, f[pos]);
					// console.log(f.subarray(pos - 10, pos + 30));

				}
				record.push(data)
			};
			records.push(record);
			// console.log(pos);
			pos = pos + 9;
		}
		// console.log(pos);
		return records;
	})(st6 + 10);

	// console.log(f);
	// console.log({
	// 	SerializationHeaderRecord,
	// 	BinaryLibrary,
	// 	BinaryArray,
	// 	SystemClassWithMembersAndTypes,
	// 	MemberReferences: MemberReferences.length,
	// 	ClassWithMembersAndTypes,
	// 	ClassRecords: ClassRecords.length
	// });


	/* JSON 변환 */
	const Data = [ClassWithMembersAndTypes.ClassInfo_MemberNames];
	// 사전 생성
	const dict = new Map();
	let cnt = 0;
	for (let record of ClassRecords) {
		const row = []
		record.map((data) => {
			if (data.RecordTypeEnumeration.readInt8() === 6) {
				dict.set(data.ObjectId.readInt32LE(), data.value)
				row.push(data.value);
			} else if (data.RecordTypeEnumeration.readInt8() === 10) {
				cnt++;
			} else if (data.RecordTypeEnumeration.readInt8() === 3) {
				// console.log(data);
			} else if (data.RecordTypeEnumeration.readInt8() === 9) {
				// console.log(data);
				if (dict.has(data.ObjectId.readInt32LE())) {
					row.push(dict.get(data.ObjectId.readInt32LE()));
				} else {
					console.error("DATA NOT FOUND: ", data);
				}
				cnt++;
			} else if (data.RecordTypeEnumeration.readInt8() === 1) {
				// wtf?
				console.log(data);
			}
		});
		Data.push(row);
	}
	// console.log(ClassRecords[0][0].RecordTypeEnumeration.readInt8());
	// console.log(dict.size);
	// console.log(cnt);
	// console.log(Data.length);
	// const csv = Data.map((dd) => {
	// 	return dd.map((cell) => "\"" + String(cell) + "\"").join(",")
	// }).join("\n");
	const csv = json2csv(Data, {
		delimiter: {
			wrap: '"', // Double Quote (") character
			field: ',', // Comma field delimiter
			eol: '\n' // Newline delimiter
		},
		prependHeader: false,
	})
	writeFileSync(`csv/${file}.csv`, csv)
};

for (let file of files) {
	await main(file);
}

