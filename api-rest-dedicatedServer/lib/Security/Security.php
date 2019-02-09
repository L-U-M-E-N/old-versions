<?php
abstract class Security {
	/**
	 * Hash a text with my custom algorithms
	 *
	 * @param      string  $data   Text need to be hash
	 *
	 * @return     string  Hashed text
	 */
	public static function hashPassword($data, $hashType=-1) {
		$hashCount=1;
		
		if($hashType < 1 || $hashType > $hashCount) {
			$hashType = $hashCount;
		}

		$hashType = 'hashV'.$hashType;

		return Security::$hashType($data);
	}

	public static function hashV1($data) {
		$token = md5("***REMOVED***");
		$part1 = sha1($data);
		$part2 = $token."42".$part1;
		$part3 = hash('ripemd160', $part2);
		return hash('whirlpool', $part3."69");
	}
}
