// import dymoURL from '../assets/DYMO.Label.Framework.3.0.txt'
import Dymo from 'dymo-connect'

export const dymo = new Dymo()

/**
 * Génère une étiquette à imprimer
 * @param {string} nom nom de l'adhérent
 * @param {string} creneaux créneaux pris par l'adhérent
 * @param {string} saison saison à afficher sur la carte
 * @returns le code xml de l'étiquette
 */
export function genereLabelContent(nom: string, creneaux: string, saison: string): string {
  // - creneaux: liste des creneaux (acronyme jour heure piscine). si plusieurs creneaux, utiliser \n
  // - saison: annee scolaire, e.g. 2021 / 2022
  return `<?xml version="1.0" encoding="utf-8"?>
<DieCutLabel Version="8.0" Units="twips">
	<PaperOrientation>Portrait</PaperOrientation>
	<Id>Small30334</Id>
	<IsOutlined>false</IsOutlined>
	<PaperName>30334 2-1/4 in x 1-1/4 in</PaperName>
	<DrawCommands>
		<RoundRectangle X="0" Y="0" Width="3240" Height="1800" Rx="270" Ry="270" />
	</DrawCommands>
	<ObjectInfo>
		<ImageObject>
			<Name>GRAPHISME</Name>
			<ForeColor Alpha="255" Red="0" Green="0" Blue="0" />
			<BackColor Alpha="0" Red="255" Green="255" Blue="255" />
			<LinkedObjectName />
			<Rotation>Rotation0</Rotation>
			<IsMirrored>False</IsMirrored>
			<IsVariable>False</IsVariable>
			<GroupID>-1</GroupID>
			<IsOutlined>False</IsOutlined>
			<Image>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</Image>
			<ScaleMode>Uniform</ScaleMode>
			<BorderWidth>0</BorderWidth>
			<BorderColor Alpha="255" Red="0" Green="0" Blue="0" />
			<HorizontalAlignment>Center</HorizontalAlignment>
			<VerticalAlignment>Center</VerticalAlignment>
		</ImageObject>
		<Bounds X="118" Y="86" Width="541.947448730469" Height="553.817626953125" />
	</ObjectInfo>
	<ObjectInfo>
		<TextObject>
			<Name>TEXTE</Name>
			<ForeColor Alpha="255" Red="0" Green="0" Blue="0" />
			<BackColor Alpha="0" Red="255" Green="255" Blue="255" />
			<LinkedObjectName />
			<Rotation>Rotation0</Rotation>
			<IsMirrored>False</IsMirrored>
			<IsVariable>False</IsVariable>
			<GroupID>-1</GroupID>
			<IsOutlined>False</IsOutlined>
			<HorizontalAlignment>Center</HorizontalAlignment>
			<VerticalAlignment>Top</VerticalAlignment>
			<TextFitMode>ShrinkToFit</TextFitMode>
			<UseFullFontHeight>True</UseFullFontHeight>
			<Verticalized>False</Verticalized>
			<StyledText>
				<Element>
					<String xml:space="preserve">VILLEURBANNE NATATION
</String>
					<Attributes>
						<Font Family="Calibri" Size="12" Bold="True" Italic="False" Underline="False" Strikeout="False" />
						<ForeColor Alpha="255" Red="0" Green="0" Blue="0" HueScale="100" />
					</Attributes>
				</Element>
				<Element>
					<String xml:space="preserve">SAISON ${saison} </String>
					<Attributes>
						<Font Family="Calibri" Size="12" Bold="False" Italic="False" Underline="False" Strikeout="False" />
						<ForeColor Alpha="255" Red="0" Green="0" Blue="0" HueScale="100" />
					</Attributes>
				</Element>
			</StyledText>
		</TextObject>
		<Bounds X="759.157653808594" Y="100.363212585449" Width="2357.71240234375" Height="559.752685546875" />
	</ObjectInfo>
	<ObjectInfo>
		<AddressObject>
			<Name>ADRESSE_2</Name>
			<ForeColor Alpha="255" Red="0" Green="0" Blue="0" />
			<BackColor Alpha="0" Red="255" Green="255" Blue="255" />
			<LinkedObjectName />
			<Rotation>Rotation0</Rotation>
			<IsMirrored>False</IsMirrored>
			<IsVariable>True</IsVariable>
			<GroupID>-1</GroupID>
			<IsOutlined>False</IsOutlined>
			<HorizontalAlignment>Center</HorizontalAlignment>
			<VerticalAlignment>Top</VerticalAlignment>
			<TextFitMode>ShrinkToFit</TextFitMode>
			<UseFullFontHeight>True</UseFullFontHeight>
			<Verticalized>False</Verticalized>
			<StyledText>
				<Element>
					<String xml:space="preserve">${creneaux}</String>
					<Attributes>
						<Font Family="Arial" Size="12" Bold="False" Italic="False" Underline="False" Strikeout="False" />
						<ForeColor Alpha="255" Red="0" Green="0" Blue="0" HueScale="100" />
					</Attributes>
				</Element>
			</StyledText>
			<ShowBarcodeFor9DigitZipOnly>False</ShowBarcodeFor9DigitZipOnly>
			<BarcodePosition>AboveAddress</BarcodePosition>
			<LineFonts>
				<Font Family="Arial" Size="12" Bold="False" Italic="False" Underline="False" Strikeout="False" />
				<Font Family="Arial" Size="12" Bold="False" Italic="False" Underline="False" Strikeout="False" />
				<Font Family="Arial" Size="12" Bold="False" Italic="False" Underline="False" Strikeout="False" />
			</LineFonts>
		</AddressObject>
		<Bounds X="195.000000000001" Y="1059" Width="2868" Height="599.999999999999" />
	</ObjectInfo>
	<ObjectInfo>
		<AddressObject>
			<Name>ADRESSE_1</Name>
			<ForeColor Alpha="255" Red="0" Green="0" Blue="0" />
			<BackColor Alpha="0" Red="255" Green="255" Blue="255" />
			<LinkedObjectName />
			<Rotation>Rotation0</Rotation>
			<IsMirrored>False</IsMirrored>
			<IsVariable>True</IsVariable>
			<GroupID>-1</GroupID>
			<IsOutlined>False</IsOutlined>
			<HorizontalAlignment>Center</HorizontalAlignment>
			<VerticalAlignment>Top</VerticalAlignment>
			<TextFitMode>ShrinkToFit</TextFitMode>
			<UseFullFontHeight>True</UseFullFontHeight>
			<Verticalized>False</Verticalized>
			<StyledText>
				<Element>
					<String xml:space="preserve">${nom}</String>
					<Attributes>
						<Font Family="Arial" Size="12" Bold="True" Italic="False" Underline="False" Strikeout="False" />
						<ForeColor Alpha="255" Red="0" Green="0" Blue="0" HueScale="100" />
					</Attributes>
				</Element>
			</StyledText>
			<ShowBarcodeFor9DigitZipOnly>False</ShowBarcodeFor9DigitZipOnly>
			<BarcodePosition>AboveAddress</BarcodePosition>
			<LineFonts>
				<Font Family="Arial" Size="12" Bold="True" Italic="False" Underline="False" Strikeout="False" />
			</LineFonts>
		</AddressObject>
		<Bounds X="159.000000000001" Y="687" Width="2892" Height="276" />
	</ObjectInfo>
</DieCutLabel>
    `
}
