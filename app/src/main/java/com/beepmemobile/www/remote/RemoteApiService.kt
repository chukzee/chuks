package com.beepmemobile.www.remote


import io.reactivex.Observable
import retrofit2.Retrofit
import retrofit2.adapter.rxjava2.RxJava2CallAdapterFactory
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.POST
import retrofit2.http.Query

interface RemoteApiService {

    @POST("/api/signup/verify_phone_number")
    fun signUpVerifyPhoneNumber(@Query("userid") user_id: String?,
                                @Query("mobile_phone_no") mobile_phone_no: String?,
                                @Query("dialling_code") dialling_code: String?,
                                @Query("country_code") country_code: String?,
                                @Query("country") country: String?): Observable<Model.ResultAuth>


    @POST("/api/signup/confirm_phone_number")
    fun signUpComfirmPhoneNumber(@Query("userid") user_id: String?,
                                 @Query("confirm_verification_code") confirm_verification_code: String?): Observable<Model.ResultAuth>

    @POST("/api/signup/name")
    fun signUpName(@Query("userid") user_id: String?,
                   @Query("first_name") first_name: String?,
                   @Query("last_name") last_name: String?): Observable<Model.ResultAuth>


    @POST("/api/signup/profile_photo")
    fun signUpProfilePhoto(@Query("userid") user_id: String?,
                           @Query("profile_photo_base64") profile_photo_base64: String?,
                           @Query("status_message") status_message: String?): Observable<Model.ResultAuth>

    @POST("/api/backup_contacts")
    fun backupContacts(@Query("userid") user_id: String?,
                       @Query("constacts") constacts: String?): Observable<Model.ResultFeedback>

    @POST("/api/update_location")
    fun updateLocation(@Query("userid") user_id: String?,
                       @Query("location") location: String?): Observable<Model.ResultFeedback>

    @POST("/api/update_last_seen")
    fun updateLastSeen(@Query("userid") user_id: String?): Observable<Model.ResultFeedback>

    @POST("/api/update_profile")
    fun updateProfile(@Query("userid") user_id: String?): Observable<Model.ResultFeedback>

    @POST("/api/restore_contacts")
    fun restoreContacts(@Query("userid") user_id: String?): Observable<Model.ResultContactList>

    @POST("/api/search_users")
    fun searchUsers(@Query("userid") user_id: String?,
                    @Query("search_string") search_string: String?,
                    @Query("offset") offset: String?,
                    @Query("limit") limit: Int): Observable<Model.ResultUser>

    @POST("/api/location_address")
    fun getLocationAddress(@Query("userid") user_id: String?): Observable<Model.ResultFeedback>

    @POST("/api/location")
    fun getLocation(@Query("userid") user_id: String?): Observable<Model.ResultFeedback>

    @POST("/api/last_seen")
    fun getLastSeen(@Query("userid") user_id: String?): Observable<Model.ResultFeedback>

    @POST("/api/contact_users")
    fun getContactUsers(@Query("contacts") contacts: String?,
                        @Query("limit") limit: Int): Observable<Model.ResultUserList>

    @POST("/api/users_by_location_address")
    fun getUsersByLocationAddress(@Query("location_address") location_address: String?,
                                  @Query("limit") limit: Int): Observable<Model.ResultUserList>

    @POST("/api/users_within_boundary")
    fun getUsersWithinBoundary(@Query("pivot_latitude") pivot_latitude: String?,
                               @Query("pivot_longitude") pivot_longitude: String?,
                               @Query("sqaure_mile") sqaure_mile: String?,
                               @Query("limit") limit: Int): Observable<Model.ResultUserList>



    companion object {
        fun create(): RemoteApiService {

            val retrofit = Retrofit.Builder()
                .addCallAdapterFactory(RxJava2CallAdapterFactory.create())
                .addConverterFactory(GsonConverterFactory.create())
                .baseUrl("https://en.wikipedia.org/w/")
                .build()

            return retrofit.create(RemoteApiService::class.java)
        }
    }

}