package com.beepmemobile.www.ui.home

import android.app.SearchManager
import android.content.ContentProvider
import android.content.ContentValues
import android.content.UriMatcher
import android.database.Cursor
import android.database.MatrixCursor
import android.net.Uri
import com.beepmemobile.www.R
import com.beepmemobile.www.dummy.Dummy

class UserSearchContentProvider: ContentProvider() {
    companion object {
        private const val STORES = "stores/" + SearchManager.SUGGEST_URI_PATH_QUERY + "/*"
        private val uriMatcher = UriMatcher(UriMatcher.NO_MATCH)
        private val matrixCursorColumns = arrayOf(
            "_ID",
            SearchManager.SUGGEST_COLUMN_TEXT_1,
            SearchManager.SUGGEST_COLUMN_ICON_1,
            SearchManager.SUGGEST_COLUMN_INTENT_DATA
        )

        init {
            uriMatcher.addURI(
                "com.beepmemobile.www.ui.home.UserSearchContentProvider",//must match the one in searchable.xml
                STORES,
                1
            )
        }
    }


    override fun onCreate(): Boolean {
        return true
    }

    override fun query(
        uri: Uri,
        projection: Array<String>?,
        selection: String?,
        selectionArgs: Array<String>?,
        sortOrder: String?
    ): Cursor? {

        return when (uriMatcher.match(uri)) {
            1 -> {
                val query = uri.lastPathSegment?.toLowerCase()?:""
                getSearchResultsCursor(query)
            }
            else -> throw IllegalArgumentException("Invalid content provider URI - must match the authority in searchable.xml")

        }
    }

    private fun loadTestRowResult(): MatrixCursor {
        val searchResults = MatrixCursor(matrixCursorColumns)

        val mRow = arrayOf<Any?>(4)

        for(i in 1..10){
            mRow[0] =  i
            mRow[1] = Dummy().createUser(i)
            mRow[2] = context?.getDrawable(R.drawable.ic_person_black_24dp)
            mRow[3] = i
            searchResults.addRow(mRow)
        }

        return searchResults
    }

    private fun getSearchResultsCursor(searchString: String): MatrixCursor {
        var searchString: String? = searchString
        var searchResults = MatrixCursor(matrixCursorColumns)

        val mRow = arrayOf<Any>(4)

        searchResults = loadTestRowResult()

        return searchResults
    }


    override fun insert(p0: Uri, p1: ContentValues?): Uri? {
        return null
    }

    override fun update(p0: Uri, p1: ContentValues?, p2: String?, p3: Array<out String>?): Int {
        return 0
    }

    override fun delete(p0: Uri, p1: String?, p2: Array<out String>?): Int {
        return 0
    }

    override fun getType(p0: Uri): String? {
        return null
    }
}